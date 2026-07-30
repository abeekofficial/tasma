import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { prisma } from '../../lib/prisma';
import { getJson, setJson } from '../../lib/redis';

// Role hierarchy constant
export const ROLE_HIERARCHY: Record<string, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 90,
  SUPPORT: 80,
  MODERATOR: 70,
  CREATOR: 60,
  PREMIUM: 50,
  USER: 30,
  GUEST: 10,
};

/**
 * Checks if user's system role is in the list OR higher in hierarchy
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required'));
    }

    const userRole = req.user.role;
    const userRoleWeight = ROLE_HIERARCHY[userRole] || 0;
    
    // Find the minimum required role weight among the specified roles
    const requiredWeights = roles.map(r => ROLE_HIERARCHY[r] || Infinity);
    const minRequiredWeight = Math.min(...requiredWeights);

    // If user's role weight is >= the minimum required weight, allow
    if (userRoleWeight >= minRequiredWeight) {
      return next();
    }
    
    // Check for exact matches just in case
    if (roles.includes(userRole)) {
      return next();
    }

    next(AppError.forbidden('Insufficient role permissions'));
  };
};

/**
 * Checks if user has a required organization role
 */
export const requireOrgRole = (orgIdParam: string, ...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      // SUPER_ADMIN bypasses all org role checks
      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }

      const orgId = req.params[orgIdParam] || req.query[orgIdParam] || req.body[orgIdParam];
      
      if (!orgId || typeof orgId !== 'string') {
        throw AppError.badRequest('Organization ID is required');
      }

      const userId = req.user.id;
      const cacheKey = `org:member:${orgId}:${userId}`;
      
      let memberRole: string | null = await getJson<string>(cacheKey);

      if (!memberRole) {
        const member = await prisma.organizationMember.findFirst({
          where: {
            organizationId: orgId,
            userId: userId,
          },
          select: { role: true },
        });

        if (!member) {
          throw AppError.forbidden('You are not a member of this organization', 'RBAC_NOT_MEMBER');
        }

        memberRole = member.role;
        await setJson(cacheKey, memberRole, 300);
      }

      const userRoleWeight = ROLE_HIERARCHY[memberRole] || 0;
      const requiredWeights = roles.map(r => ROLE_HIERARCHY[r] || Infinity);
      const minRequiredWeight = Math.min(...requiredWeights);

      if (userRoleWeight >= minRequiredWeight || roles.includes(memberRole)) {
        req.organizationId = orgId;
        return next();
      }

      throw AppError.forbidden('Insufficient organization role permissions', 'RBAC_INSUFFICIENT_ROLE');
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Checks ProjectCollaborator permissions
 */
export const requireProjectPermission = (projectIdParam: string, ...permissions: string[]) => {
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
        where: {
          projectId,
          userId: req.user.id,
        },
      });

      if (!collaborator) {
        // Fallback: Check if user has org-level access (if project belongs to org)
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          select: { workspaceId: true, workspace: { select: { organizationId: true } } }
        });

        if (project && project.workspace.organizationId) {
          const orgMember = await prisma.organizationMember.findFirst({
            where: {
              organizationId: project.workspace.organizationId,
              userId: req.user.id
            }
          });

          if (orgMember && ROLE_HIERARCHY[orgMember.role] >= ROLE_HIERARCHY['ADMIN']) {
            return next();
          }
        }
        
        throw AppError.forbidden('You do not have access to this project');
      }

      const roleStr = collaborator.role as string;
      
      // Basic check based on project roles OWNER, EDITOR, COMMENTER, VIEWER
      // If ANY required permission is met by role
      const PROJECT_ROLES: Record<string, string[]> = {
        OWNER: ['project.read', 'project.update', 'project.delete', 'project.manage_collaborators', 'project.export'],
        EDITOR: ['project.read', 'project.update', 'project.export'],
        COMMENTER: ['project.read', 'project.comment'],
        VIEWER: ['project.read']
      };

      const userPerms = PROJECT_ROLES[roleStr] || [];
      const hasPerm = permissions.some(p => userPerms.includes(p));

      if (!hasPerm) {
        throw AppError.forbidden('Insufficient project permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
