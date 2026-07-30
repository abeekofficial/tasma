import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { prisma as prismaClient } from '@/lib/prisma';

export class ApiKeyService {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async createApiKey(userId: string, orgId: string, name: string, permissions: string[], expiresAt?: Date) {
    const rawKey = crypto.randomBytes(32).toString('hex');
    const fullKey = 'tk_' + rawKey;
    const prefix = fullKey.substring(3, 11);
    const hash = crypto.createHash('sha256').update(fullKey).digest('hex');

    const keyRecord = await this.prisma.apiKey.create({
      data: {
        userId,
        orgId,
        name,
        prefix,
        hash,
        permissions,
        expiresAt,
      },
    });

    return {
      id: keyRecord.id,
      name: keyRecord.name,
      prefix: keyRecord.prefix,
      key: fullKey,
      permissions: keyRecord.permissions,
      expiresAt: keyRecord.expiresAt,
      createdAt: keyRecord.createdAt,
    };
  }

  public async listApiKeys(userId: string, orgId?: string) {
    const where: any = { userId, revokedAt: null };
    if (orgId) where.orgId = orgId;

    const keys = await this.prisma.apiKey.findMany({ where, orderBy: { createdAt: 'desc' } });
    return keys.map(k => ({
      id: k.id,
      name: k.name,
      prefix: k.prefix,
      permissions: k.permissions,
      lastUsedAt: k.lastUsedAt,
      expiresAt: k.expiresAt,
      createdAt: k.createdAt,
    }));
  }

  public async revokeApiKey(keyId: string, userId: string) {
    await this.prisma.apiKey.update({
      where: { id: keyId },
      data: { revokedAt: new Date() },
    });
    await this.prisma.auditLog.create({
      data: { action: 'API_KEY_REVOKED', userId, metadata: { keyId } },
    });
  }

  public async validateApiKey(rawKey: string) {
    const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyRecord = await this.prisma.apiKey.findFirst({
      where: { hash, revokedAt: null },
      include: { user: true },
    });

    if (!keyRecord || (keyRecord.expiresAt && keyRecord.expiresAt < new Date())) {
      throw new AppError(ERROR_CODES.UNAUTHORIZED, 'Invalid or expired API key');
    }

    await this.prisma.apiKey.update({
      where: { id: keyRecord.id },
      data: { lastUsedAt: new Date() },
    });

    return keyRecord;
  }

  public async rotateApiKey(keyId: string, userId: string) {
    const existing = await this.prisma.apiKey.findUnique({ where: { id: keyId } });
    if (!existing || existing.userId !== userId) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Key not found');
    }

    await this.revokeApiKey(keyId, userId);
    return this.createApiKey(userId, existing.orgId!, existing.name, existing.permissions as string[], existing.expiresAt || undefined);
  }
}

export const apiKeyService = new ApiKeyService();
