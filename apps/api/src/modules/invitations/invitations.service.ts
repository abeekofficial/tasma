import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { prisma as prismaClient } from '@/lib/prisma';
// import { emailService } from '@/infrastructure/email/email.service'; // Normally injected/imported

export class InvitationsService {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async createInvitation(orgId: string, email: string, role: string, inviterId: string) {
    const existingMember = await this.prisma.organizationMember.findFirst({
      where: { orgId, user: { email } },
    });
    if (existingMember) throw new AppError(ERROR_CODES.CONFLICT, 'User is already a member');

    const pendingInvite = await this.prisma.organizationInvite.findFirst({
      where: { orgId, email, status: 'PENDING' },
    });
    if (pendingInvite) throw new AppError(ERROR_CODES.CONFLICT, 'Pending invite already exists');

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invite = await this.prisma.organizationInvite.create({
      data: {
        token,
        orgId,
        email,
        role,
        inviterId,
        status: 'PENDING',
        expiresAt,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'INVITATION_CREATED',
        userId: inviterId,
        metadata: { orgId, email, role },
      },
    });

    // await emailService.sendOrgInviteEmail(email, org.name, inviter.name, role, token);

    return invite;
  }

  public async acceptInvitation(token: string, userId: string) {
    const invite = await this.prisma.organizationInvite.findUnique({ where: { token } });
    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      throw new AppError(ERROR_CODES.BAD_REQUEST, 'Invalid or expired invitation');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');

    const existingMember = await this.prisma.organizationMember.findUnique({
      where: { orgId_userId: { orgId: invite.orgId, userId } },
    });
    if (existingMember) throw new AppError(ERROR_CODES.CONFLICT, 'Already a member');

    await this.prisma.$transaction(async (tx) => {
      await tx.organizationMember.create({
        data: { orgId: invite.orgId, userId, role: invite.role },
      });
      await tx.organizationInvite.update({
        where: { token },
        data: { status: 'ACCEPTED' },
      });
      await tx.auditLog.create({
        data: {
          action: 'INVITATION_ACCEPTED',
          userId,
          metadata: { orgId: invite.orgId, email: invite.email },
        },
      });
    });

    // await emailService.sendWelcomeEmail(user.email, user.name);
  }

  public async rejectInvitation(token: string) {
    const invite = await this.prisma.organizationInvite.findUnique({ where: { token } });
    if (!invite || invite.status !== 'PENDING') throw new AppError(ERROR_CODES.BAD_REQUEST, 'Invalid invitation');

    await this.prisma.organizationInvite.delete({ where: { token } });
  }

  public async revokeInvitation(inviteId: string, actorId: string) {
    await this.prisma.organizationInvite.update({
      where: { id: inviteId },
      data: { status: 'REVOKED' },
    });
    await this.prisma.auditLog.create({
      data: { action: 'INVITATION_REVOKED', userId: actorId, metadata: { inviteId } },
    });
  }

  public async listInvitations(orgId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.organizationInvite.findMany({ where: { orgId }, skip, take: limit }),
      this.prisma.organizationInvite.count({ where: { orgId } }),
    ]);
    return { data, total, page, limit };
  }

  public async resendInvitation(inviteId: string, actorId: string) {
    const invite = await this.prisma.organizationInvite.findUnique({ where: { id: inviteId } });
    if (!invite || invite.status !== 'PENDING') throw new AppError(ERROR_CODES.BAD_REQUEST, 'Cannot resend');
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.prisma.organizationInvite.update({
      where: { id: inviteId },
      data: { expiresAt },
    });

    await this.prisma.auditLog.create({
      data: { action: 'INVITATION_RESENT', userId: actorId, metadata: { inviteId } },
    });
  }
}

export const invitationsService = new InvitationsService();
