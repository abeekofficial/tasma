import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { AuthenticatedUser, SessionInfo, AuthEvent } from './auth.types';
import { prisma as prismaClient } from '@/lib/prisma';
import { redis as redisClient } from '@/lib/redis';

export class AuthService {
  constructor(
    private readonly prisma: PrismaClient = prismaClient,
    private readonly redis: Redis = redisClient
  ) {}

  /**
   * Retrieves the current user with their profile and organizations.
   * Uses Redis caching with a 300s TTL.
   */
  public async getCurrentUser(userId: string): Promise<AuthenticatedUser & { profile: any; organizations: any[] }> {
    const cacheKey = `tasma:user:${userId}`;
    const cachedUser = await (this.redis as any).getJson?.(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user || user.status === 'DELETED') {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'User not found');
    }

    const result = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      profile: user.profile,
      organizations: user.organizationMembers.map(om => ({
        ...om.organization,
        role: om.role,
      })),
    };

    await (this.redis as any).setJson?.(cacheKey, result, 300);

    return result;
  }

  /**
   * Updates last login time and IP address.
   */
  public async updateLastLogin(userId: string, ipAddress: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
      },
    });

    const cacheKey = `tasma:user:${userId}`;
    await (this.redis as any).del?.(cacheKey);
  }

  /**
   * Retrieves active sessions for a user.
   */
  public async getActiveSessions(userId: string, currentSessionId?: string): Promise<SessionInfo[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return sessions.map(session => ({
      id: session.id,
      userId: session.userId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      isCurrent: session.id === currentSessionId,
    }));
  }

  /**
   * Revokes a specific session.
   */
  public async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Session not found');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    await this.prisma.auditLog.create({
      data: {
        action: AuthEvent.LOGOUT,
        userId,
        metadata: { sessionId },
      },
    });
  }

  /**
   * Revokes all sessions except the current one.
   */
  public async revokeAllSessions(userId: string, currentSessionId: string): Promise<{ count: number }> {
    const result = await this.prisma.session.deleteMany({
      where: {
        userId,
        id: {
          not: currentSessionId,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        action: AuthEvent.LOGOUT,
        userId,
        metadata: { event: 'REVOKE_ALL', excludedSession: currentSessionId },
      },
    });

    return { count: result.count };
  }

  /**
   * Deactivates the user's account.
   */
  public async deactivateAccount(userId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: {
          status: 'DELETED',
          deletedAt: new Date(),
        },
      });

      await tx.session.deleteMany({
        where: { userId },
      });

      await tx.auditLog.create({
        data: {
          action: AuthEvent.ACCOUNT_DEACTIVATED,
          userId,
        },
      });
    });

    const cacheKey = `tasma:user:${userId}`;
    await (this.redis as any).del?.(cacheKey);
  }

  /**
   * Fetches the user's audit log.
   */
  public async getAuditLog(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where: { userId } }),
    ]);

    return { data, total, page, limit };
  }
}

export const authService = new AuthService();
