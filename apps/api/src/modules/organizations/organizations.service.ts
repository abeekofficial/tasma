import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { organizationRepository, OrganizationRepository } from './organizations.repository';
import { prisma as prismaClient } from '@/lib/prisma';

export class OrganizationService {
  constructor(
    private readonly repo: OrganizationRepository = organizationRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async createOrganization(userId: string, data: any) {
    const existing = await this.repo.findBySlug(data.slug);
    if (existing) {
      throw new AppError(ERROR_CODES.CONFLICT, 'Slug already in use');
    }

    const org = await this.prisma.$transaction(async (tx) => {
      const createdOrg = await tx.organization.create({ data });
      
      await tx.organizationMember.create({
        data: {
          orgId: createdOrg.id,
          userId,
          role: 'OWNER',
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'ORGANIZATION_CREATED',
          userId,
          metadata: { orgId: createdOrg.id },
        },
      });

      return createdOrg;
    });

    return org;
  }

  public async getOrganization(orgId: string, userId: string) {
    const org = await this.repo.findById(orgId);
    if (!org) throw new AppError(ERROR_CODES.NOT_FOUND, 'Organization not found');

    const member = await this.repo.findMember(orgId, userId);
    if (!member) throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied');

    return org;
  }

  public async updateOrganization(orgId: string, data: any, actorId: string) {
    const org = await this.repo.update(orgId, data);
    await this.prisma.auditLog.create({
      data: {
        action: 'ORGANIZATION_UPDATED',
        userId: actorId,
        metadata: { orgId, updates: data },
      },
    });
    return org;
  }

  public async deleteOrganization(orgId: string, actorId: string) {
    await this.repo.softDelete(orgId);
    await this.prisma.auditLog.create({
      data: {
        action: 'ORGANIZATION_DELETED',
        userId: actorId,
        metadata: { orgId },
      },
    });
  }

  public async getMembers(orgId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findMembers(orgId, { skip, take: limit });
    return { data, total, page, limit };
  }

  public async updateMemberRole(orgId: string, memberId: string, role: string, actorId: string) {
    const target = await this.repo.findMember(orgId, memberId);
    if (!target) throw new AppError(ERROR_CODES.NOT_FOUND, 'Member not found');
    if (target.role === 'OWNER') throw new AppError(ERROR_CODES.FORBIDDEN, 'Cannot demote OWNER directly');

    const updated = await this.repo.updateMemberRole(orgId, memberId, role);
    await this.prisma.auditLog.create({
      data: {
        action: 'MEMBER_ROLE_UPDATED',
        userId: actorId,
        metadata: { orgId, targetUserId: memberId, newRole: role },
      },
    });
    return updated;
  }

  public async removeMember(orgId: string, memberId: string, actorId: string) {
    const target = await this.repo.findMember(orgId, memberId);
    if (!target) throw new AppError(ERROR_CODES.NOT_FOUND, 'Member not found');
    if (target.role === 'OWNER') throw new AppError(ERROR_CODES.FORBIDDEN, 'Cannot remove OWNER');

    await this.repo.removeMember(orgId, memberId);
    await this.prisma.auditLog.create({
      data: {
        action: 'MEMBER_REMOVED',
        userId: actorId,
        metadata: { orgId, targetUserId: memberId },
      },
    });
  }

  public async transferOwnership(orgId: string, newOwnerId: string, actorId: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.organizationMember.update({
        where: { orgId_userId: { orgId, userId: actorId } },
        data: { role: 'ADMIN' },
      });
      await tx.organizationMember.update({
        where: { orgId_userId: { orgId, userId: newOwnerId } },
        data: { role: 'OWNER' },
      });
      await tx.auditLog.create({
        data: {
          action: 'OWNERSHIP_TRANSFERRED',
          userId: actorId,
          metadata: { orgId, newOwnerId },
        },
      });
    });
  }

  public async getOrganizationsForUser(userId: string) {
    const members = await this.prisma.organizationMember.findMany({
      where: { userId },
      include: { organization: true },
    });
    return members.map(m => ({ ...m.organization, role: m.role }));
  }
}

export const organizationService = new OrganizationService();
