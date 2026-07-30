import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { hasAnyPermission, ROLE_PERMISSIONS } from '../guards/permissions';
import { prisma } from '../../lib/prisma';
import { getJson, setJson } from '../../lib/redis';

/**
 * Checks if user's system role has ANY of the specified permissions
 */
export const requirePermission = (...perms: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    if (hasAnyPermission(req.user.role, perms)) {
      return next();
    }

    next(AppError.forbidden('Insufficient permissions for this action', 'RBAC_INSUFFICIENT_PERMISSION'));
  };
};

/**
 * Checks organization-level permissions based on org role
 */
export const requireOrgPermission = (orgIdParam: string, ...perms: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      const orgId = req.params[orgIdParam] || req.body[orgIdParam] || req.query[orgIdParam];
      if (!orgId || typeof orgId !== 'string') {
        throw AppError.badRequest('Organization ID is required');
      }

      const cacheKey = `org:member:${orgId}:${req.user.id}`;
      let memberRole = await getJson<string>(cacheKey);

      if (!memberRole) {
        const member = await prisma.organizationMember.findFirst({
          where: { organizationId: orgId, userId: req.user.id },
          select: { role: true },
        });

        if (!member) {
          throw AppError.forbidden('Not a member of this organization', 'RBAC_NOT_MEMBER');
        }

        memberRole = member.role;
        await setJson(cacheKey, memberRole, 300);
      }

      const rolePermissions = ROLE_PERMISSIONS[memberRole] || [];
      const hasPerm = perms.some(p => rolePermissions.includes(p));

      if (!hasPerm) {
        throw AppError.forbidden('Insufficient organization permissions', 'RBAC_INSUFFICIENT_PERMISSION');
      }

      req.organizationId = orgId;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Map project collaborator roles to permissions
 */
const PROJECT_COLLABORATOR_PERMISSIONS: Record<string, string[]> = {
  OWNER: ['project.read', 'project.update', 'project.delete', 'project.manage_collaborators', 'project.export', 'project.publish', 'project.share'],
  EDITOR: ['project.read', 'project.update', 'project.export'],
  COMMENTER: ['project.read', 'project.comment'],
  VIEWER: ['project.read'],
};

/**
 * Checks project-level access permissions
 */
export const requireProjectAccess = (projectIdParam: string, ...perms: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      const projectId = req.params[projectIdParam];
      if (!projectId) {
        throw AppError.badRequest('Project ID is required');
      }

      const collaborator = await prisma.projectCollaborator.findFirst({
        where: { projectId, userId: req.user.id },
      });

      if (!collaborator) {
        // Fallback to org admin check
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { workspace: { select: { organizationId: true } } }
        });

        if (project?.workspace.organizationId) {
          const orgMember = await prisma.organizationMember.findFirst({
            where: {
              organizationId: project.workspace.organizationId,
              userId: req.user.id,
              role: { in: ['OWNER', 'ADMIN'] }
            }
          });

          if (orgMember) {
            return next();
          }
        }

        throw AppError.forbidden('You do not have access to this project');
      }

      const rolePerms = PROJECT_COLLABORATOR_PERMISSIONS[collaborator.role] || [];
      const hasPerm = perms.some(p => rolePerms.includes(p));

      if (!hasPerm) {
        throw AppError.forbidden('Insufficient project permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
