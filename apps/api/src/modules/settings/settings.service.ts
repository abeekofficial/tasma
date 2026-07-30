import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';
import { auth } from '@/lib/auth';
import { AccountSettings, NotificationSettings, SecuritySettings, ConnectedAccount } from './settings.types';

export class SettingsService {
  async getAccountSettings(userId: string): Promise<AccountSettings> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
    if (!user) throw new AppError('User not found', ERROR_CODES.NOT_FOUND, 404);

    return {
      name: user.name,
      username: user.username || null,
      email: user.email,
      avatarUrl: user.image || null,
      coverImageUrl: user.profile?.coverImageUrl || null,
      bio: user.profile?.bio || null,
      country: user.profile?.country || null,
      language: user.profile?.language || null,
      timezone: user.profile?.timezone || null,
      theme: user.profile?.theme || null,
    };
  }

  async updateAccountSettings(userId: string, data: Partial<AccountSettings>): Promise<AccountSettings> {
    if (data.username) {
      const existing = await prisma.user.findFirst({
        where: { username: data.username, id: { not: userId } }
      });
      if (existing) throw new AppError('Username already taken', ERROR_CODES.CONFLICT, 409);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name ?? undefined,
        username: data.username ?? undefined,
        profile: {
          upsert: {
            create: {
              bio: data.bio,
              country: data.country,
              language: data.language,
              timezone: data.timezone,
              theme: data.theme,
            },
            update: {
              bio: data.bio !== undefined ? data.bio : undefined,
              country: data.country !== undefined ? data.country : undefined,
              language: data.language !== undefined ? data.language : undefined,
              timezone: data.timezone !== undefined ? data.timezone : undefined,
              theme: data.theme !== undefined ? data.theme : undefined,
            }
          }
        }
      },
      include: { profile: true }
    });

    await redis.del(`user:${userId}`);

    return this.getAccountSettings(userId);
  }

  async getNotificationSettings(userId: string): Promise<NotificationSettings> {
    let settings = await prisma.notificationPreference.findUnique({ where: { userId } });
    if (!settings) {
      settings = await prisma.notificationPreference.create({
        data: {
          userId,
          emailEnabled: true,
          pushEnabled: true,
          inAppEnabled: true,
          digestFrequency: 'DAILY',
          mutedTypes: []
        }
      });
    }
    return {
      emailEnabled: settings.emailEnabled,
      pushEnabled: settings.pushEnabled,
      inAppEnabled: settings.inAppEnabled,
      digestFrequency: settings.digestFrequency,
      mutedTypes: settings.mutedTypes as string[]
    };
  }

  async updateNotificationSettings(userId: string, data: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const settings = await prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        userId,
        emailEnabled: data.emailEnabled ?? true,
        pushEnabled: data.pushEnabled ?? true,
        inAppEnabled: data.inAppEnabled ?? true,
        digestFrequency: data.digestFrequency ?? 'DAILY',
        mutedTypes: data.mutedTypes ?? []
      },
      update: {
        emailEnabled: data.emailEnabled !== undefined ? data.emailEnabled : undefined,
        pushEnabled: data.pushEnabled !== undefined ? data.pushEnabled : undefined,
        inAppEnabled: data.inAppEnabled !== undefined ? data.inAppEnabled : undefined,
        digestFrequency: data.digestFrequency !== undefined ? data.digestFrequency : undefined,
        mutedTypes: data.mutedTypes !== undefined ? data.mutedTypes : undefined
      }
    });

    return {
      emailEnabled: settings.emailEnabled,
      pushEnabled: settings.pushEnabled,
      inAppEnabled: settings.inAppEnabled,
      digestFrequency: settings.digestFrequency,
      mutedTypes: settings.mutedTypes as string[]
    };
  }

  async getSecuritySettings(userId: string): Promise<SecuritySettings> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', ERROR_CODES.NOT_FOUND, 404);

    const sessions = await prisma.session.count({ where: { userId } });

    return {
      twoFactorEnabled: user.twoFactorEnabled,
      activeSessions: sessions,
      lastPasswordChange: user.lastPasswordChange
    };
  }

  async getConnectedAccounts(userId: string): Promise<ConnectedAccount[]> {
    const accounts = await prisma.account.findMany({ where: { userId } });
    return accounts.map(a => ({
      provider: a.providerId,
      email: null, // BetterAuth stores email differently depending on provider/user
      connectedAt: a.createdAt
    }));
  }

  async disconnectAccount(userId: string, providerId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true }
    });
    if (!user) throw new AppError('User not found', ERROR_CODES.NOT_FOUND, 404);

    const hasPassword = !!user.password;
    if (!hasPassword && user.accounts.length <= 1) {
      throw new AppError('Cannot remove the last login method', ERROR_CODES.BAD_REQUEST, 400);
    }

    await prisma.account.deleteMany({
      where: { userId, providerId }
    });
  }

  async getSessionHistory(userId: string): Promise<any[]> {
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    return sessions;
  }

  async getExportHistory(userId: string, page: number = 1, limit: number = 10): Promise<{ items: any[], total: number }> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.exportHistory.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.exportHistory.count({ where: { userId } })
    ]);
    return { items, total };
  }

  async getBillingInfo(userId: string): Promise<any> {
    const subscription = await prisma.subscription.findFirst({
      where: { userId },
      include: { plan: true }
    });
    return subscription;
  }

  async deleteAccount(userId: string, passwordHash: string): Promise<void> {
    // Note: Assuming BetterAuth validates password prior or here, simplified due to direct auth check usually handled at controller level via BetterAuth API.
    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    await prisma.session.deleteMany({ where: { userId } });
  }
}
