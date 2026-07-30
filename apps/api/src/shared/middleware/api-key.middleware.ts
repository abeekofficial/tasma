import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { AppError } from '../errors/app-error';
import { getJson, setJson } from '../../lib/redis';

/**
 * Extracts and validates API key from headers
 */
export const requireApiKey = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let rawKey = req.headers['x-api-key'] as string;
    
    if (!rawKey && req.headers.authorization?.startsWith('Bearer tk_')) {
      rawKey = req.headers.authorization.substring(7);
    }

    if (!rawKey) {
      throw AppError.unauthorized('API key is missing');
    }

    const hashedKey = crypto.createHash('sha256').update(rawKey).digest('hex');
    const cacheKey = `apikey:${hashedKey}`;
    
    let apiKeyData = await getJson<any>(cacheKey);

    if (!apiKeyData) {
      const dbKey = await prisma.apiKey.findUnique({
        where: { key: hashedKey },
        include: { user: true, organization: true }
      });

      if (!dbKey) {
        throw AppError.unauthorized('Invalid API key');
      }

      if (dbKey.revokedAt) {
        throw AppError.unauthorized('API key has been revoked');
      }

      if (dbKey.expiresAt && dbKey.expiresAt < new Date()) {
        throw AppError.unauthorized('API key has expired');
      }

      apiKeyData = {
        id: dbKey.id,
        userId: dbKey.userId,
        organizationId: dbKey.organizationId,
        permissions: dbKey.permissions,
        user: {
          id: dbKey.user.id,
          email: dbKey.user.email,
          role: dbKey.user.role,
        }
      };

      await setJson(cacheKey, apiKeyData, 60); // cache for 60 seconds
    }

    // Update last used at asynchronously
    prisma.apiKey.update({
      where: { id: apiKeyData.id },
      data: { lastUsedAt: new Date() }
    }).catch(err => console.error('Failed to update API key lastUsedAt:', err));

    req.apiKey = {
      id: apiKeyData.id,
      userId: apiKeyData.userId,
      organizationId: apiKeyData.organizationId,
      permissions: apiKeyData.permissions
    };

    req.user = apiKeyData.user;
    if (apiKeyData.organizationId) {
      req.organizationId = apiKeyData.organizationId;
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Checks if the API key has the required permissions
 */
export const requireApiKeyPermission = (...perms: string[]) => {
  return [
    requireApiKey,
    (req: Request, res: Response, next: NextFunction): void => {
      const apiKeyPerms = req.apiKey?.permissions || [];
      
      const hasPerm = perms.some(p => apiKeyPerms.includes(p) || apiKeyPerms.includes('*'));
      
      if (!hasPerm) {
        next(AppError.forbidden('API key lacks required permissions'));
        return;
      }
      
      next();
    }
  ];
};
