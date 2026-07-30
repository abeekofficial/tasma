import { prisma } from '@/lib/prisma';
import { AppError } from '@/shared/errors/app-error';

/**
 * AccountLockService handles brute-force protection, account lockout,
 * and suspicious login detection for the Tasma platform.
 */
export class AccountLockService {
  static readonly MAX_FAILED_ATTEMPTS = 5;
  static readonly LOCK_DURATION_MINUTES = 30;

  /**
   * Records a failed login attempt. If the threshold is exceeded,
   * locks the account for the configured duration.
   */
  static async recordFailedLogin(userId: string, ipAddress: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const newAttempts = user.failedLoginAttempts + 1;
    const isLocked = newAttempts >= AccountLockService.MAX_FAILED_ATTEMPTS;
    const lockedUntil = isLocked
      ? new Date(Date.now() + AccountLockService.LOCK_DURATION_MINUTES * 60 * 1000)
      : null;

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          failedLoginAttempts: newAttempts,
          lockedUntil,
        },
      }),
      prisma.auditLog.create({
        data: {
          userId,
          action: 'FAILED_LOGIN',
          resourceType: 'User',
          resourceId: userId,
          newData: { attempt: newAttempts, isLocked, ipAddress },
          ipAddress,
        },
      }),
    ]);

    if (isLocked) {
      console.warn(
        `[AccountLock] User ${userId} locked out after ${newAttempts} failed attempts from ${ipAddress}`,
      );
    }
  }

  /**
   * Checks if an account is currently locked. Automatically unlocks
   * if the lock period has expired.
   */
  static async checkAccountLock(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lockedUntil: true, failedLoginAttempts: true },
    });
    if (!user) return;

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMs = user.lockedUntil.getTime() - Date.now();
      const remainingMinutes = Math.ceil(remainingMs / 60_000);
      throw AppError.forbidden(
        `Account is temporarily locked due to too many failed login attempts. Try again in ${remainingMinutes} minute(s).`,
      );
    }

    if (user.lockedUntil && user.lockedUntil <= new Date()) {
      await AccountLockService.resetFailedAttempts(userId);
    }
  }

  /**
   * Resets the failed login counter and removes the lock timestamp.
   * Called after a successful login or when a lock expires.
   */
  static async resetFailedAttempts(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  /**
   * Detects suspicious login activity by comparing the current IP
   * with the last known login IP. Flags the user account and creates
   * an audit entry when a discrepancy is found.
   */
  static async detectSuspiciousLogin(
    userId: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastLoginIp: true, email: true },
    });
    if (!user) return false;

    const isSuspicious = Boolean(user.lastLoginIp && user.lastLoginIp !== ipAddress);

    if (isSuspicious) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { suspiciousLoginDetected: true },
        }),
        prisma.auditLog.create({
          data: {
            userId,
            action: 'SUSPICIOUS_LOGIN',
            resourceType: 'User',
            resourceId: userId,
            previousData: { lastIp: user.lastLoginIp },
            newData: { currentIp: ipAddress, userAgent },
            ipAddress,
          },
        }),
      ]);

      console.warn(
        `[AccountLock] Suspicious login for user ${userId}: IP changed from ${user.lastLoginIp} to ${ipAddress}`,
      );
    }

    return isSuspicious;
  }

  /**
   * Clears the suspicious login flag after a user acknowledges the alert.
   */
  static async acknowledgeSecurityAlert(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { suspiciousLoginDetected: false },
    });
  }
}
