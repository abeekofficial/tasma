import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

const requirePermission = (permission: string) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  if (user.role === 'SUPER_ADMIN') return next();
  
  const permissions = user.permissions || [];
  if (permissions.includes(permission)) return next();
  
  return res.status(403).json({ error: 'Forbidden' });
};

describe('Permission Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { user: undefined } as any;
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('requirePermission', () => {
    it('Allows user with matching permission', () => {
      (req as any).user = { role: 'USER', permissions: ['project.read'] };
      requirePermission('project.read')(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('Rejects user without permission', () => {
      (req as any).user = { role: 'USER', permissions: ['project.read'] };
      requirePermission('project.write')(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('SUPER_ADMIN has all permissions', () => {
      (req as any).user = { role: 'SUPER_ADMIN', permissions: [] };
      requirePermission('project.delete')(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
