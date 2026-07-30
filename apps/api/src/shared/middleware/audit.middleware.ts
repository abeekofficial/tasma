import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';

export enum AUDIT_ACTIONS {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',
  INVITE_SENT = 'INVITE_SENT',
  INVITE_ACCEPTED = 'INVITE_ACCEPTED',
  INVITE_REJECTED = 'INVITE_REJECTED',
  INVITE_REVOKED = 'INVITE_REVOKED',
  ORG_CREATED = 'ORG_CREATED',
  ORG_UPDATED = 'ORG_UPDATED',
  ORG_DELETED = 'ORG_DELETED',
  WORKSPACE_CREATED = 'WORKSPACE_CREATED',
  WORKSPACE_UPDATED = 'WORKSPACE_UPDATED',
  WORKSPACE_DELETED = 'WORKSPACE_DELETED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  PROJECT_PUBLISHED = 'PROJECT_PUBLISHED',
  PROJECT_SHARED = 'PROJECT_SHARED',
  MEMBER_ADDED = 'MEMBER_ADDED',
  MEMBER_REMOVED = 'MEMBER_REMOVED',
  API_KEY_CREATED = 'API_KEY_CREATED',
  API_KEY_REVOKED = 'API_KEY_REVOKED',
  EXPORT_CREATED = 'EXPORT_CREATED',
  RENDER_STARTED = 'RENDER_STARTED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  REGISTER = 'REGISTER',
}

interface AuditEntryData {
  userId?: string;
  organizationId?: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousData?: unknown;
  newData?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  sessionId?: string;
}

/**
 * Creates an audit log entry
 */
export async function createAuditEntry(data: AuditEntryData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        organizationId: data.organizationId,
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        previousData: data.previousData as any,
        newData: data.newData as any,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        sessionId: data.sessionId,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
  }
}

/**
 * Express middleware to automatically log audit events
 */
export const auditMiddleware = (action: string, resourceType: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.on('finish', () => {
      // Only log on successful creation/update/delete
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const resourceId = req.params.id || req.body?.id || res.locals?.resourceId || 'unknown';
        const ip = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
        const userAgent = req.headers['user-agent'] || 'unknown';
        
        createAuditEntry({
          userId: req.user?.id,
          organizationId: req.organizationId,
          action,
          resourceType,
          resourceId,
          ipAddress: ip,
          userAgent,
          sessionId: req.session?.id,
        }).catch(err => console.error('Audit middleware error:', err));
      }
    });
    
    next();
  };
};
