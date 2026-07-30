import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { userRepository, UserRepository } from './users.repository';
import { prisma as prismaClient } from '@/lib/prisma';

export class UserService {
  constructor(
    private readonly repo: UserRepository = userRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async getUser(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
    }
    return user;
  }

  public async listUsers(filters: { search?: string; role?: string; status?: string; page: number; limit: number }) {
    return this.repo.findMany(filters);
  }

  public async updateUser(userId: string, data: any, actorId: string) {
    const user = await this.repo.update(userId, data);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'USER_UPDATED',
        userId: actorId,
        metadata: { targetUserId: userId, updates: data },
      },
    });

    return user;
  }

  public async updateProfile(userId: string, profileData: any) {
    return this.prisma.userProfile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
    });
  }

  public async suspendUser(userId: string, actorId: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { status: 'SUSPENDED' },
      });
      await tx.session.deleteMany({ where: { userId } });
      await tx.auditLog.create({
        data: {
          action: 'USER_SUSPENDED',
          userId: actorId,
          metadata: { targetUserId: userId },
        },
      });
    });
  }

  public async banUser(userId: string, actorId: string) {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { status: 'BANNED' },
      });
      await tx.session.deleteMany({ where: { userId } });
      await tx.auditLog.create({
        data: {
          action: 'USER_BANNED',
          userId: actorId,
          metadata: { targetUserId: userId },
        },
      });
    });
  }

  public async restoreUser(userId: string, actorId: string) {
    await this.repo.restore(userId);
    await this.prisma.auditLog.create({
      data: {
        action: 'USER_RESTORED',
        userId: actorId,
        metadata: { targetUserId: userId },
      },
    });
  }

  public async deleteUser(userId: string, actorId: string) {
    await this.repo.softDelete(userId);
    await this.prisma.auditLog.create({
      data: {
        action: 'USER_DELETED',
        userId: actorId,
        metadata: { targetUserId: userId },
      },
    });
  }
}

export const userService = new UserService();
