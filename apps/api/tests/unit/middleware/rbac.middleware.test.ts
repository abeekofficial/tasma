import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response, NextFunction } from 'express';

const requireRole = (requiredRole: string) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  if (user.role === 'SUPER_ADMIN') return next();
  if (user.role === requiredRole) return next();
  
  return res.status(403).json({ error: 'Forbidden' });
};

const requireOrgRole = (requiredRole: string) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  const orgMember = (req as any).orgMember; // populated by earlier middleware
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
  if (user.role === 'SUPER_ADMIN') return next();
  if (!orgMember) return res.status(403).json({ error: 'Not a member' });
  if (orgMember.role === requiredRole || orgMember.role === 'OWNER') return next();
  
  return res.status(403).json({ error: 'Forbidden' });
};

describe('RBAC Middleware', () => {
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

  describe('requireRole', () => {
    it('Allows SUPER_ADMIN for any role check', () => {
      (req as any).user = { role: 'SUPER_ADMIN' };
      requireRole('ADMIN')(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('Allows matching role', () => {
      (req as any).user = { role: 'ADMIN' };
      requireRole('ADMIN')(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('Rejects lower role', () => {
      (req as any).user = { role: 'USER' };
      requireRole('ADMIN')(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('requireOrgRole', () => {
    it('Allows matching org role', () => {
      (req as any).user = { role: 'USER' };
      (req as any).orgMember = { role: 'ADMIN' };
      requireOrgRole('ADMIN')(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('SUPER_ADMIN bypasses org role check', () => {
      (req as any).user = { role: 'SUPER_ADMIN' };
      requireOrgRole('ADMIN')(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });

    it('Returns 403 for non-member', () => {
      (req as any).user = { role: 'USER' };
      (req as any).orgMember = null;
      requireOrgRole('MEMBER')(req as Request, res as Response, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
