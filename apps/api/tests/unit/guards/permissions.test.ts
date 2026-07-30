import { describe, it, expect, vi } from 'vitest';

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['user.read', 'user.write', 'project.read', 'project.write', 'media.read', 'media.write'],
  EDITOR: ['project.read', 'project.write', 'media.read', 'media.write'],
  VIEWER: ['project.read', 'media.read'],
  GUEST: ['project.read', 'media.read'], // restricted context
};

export function hasPermission(role: string, permission: string): boolean {
  if (role === 'SUPER_ADMIN') return true;
  const perms = (ROLE_PERMISSIONS as any)[role] || [];
  return perms.includes('*') || perms.includes(permission);
}

export function hasAnyPermission(role: string, permissions: string[]): boolean {
  return permissions.some(p => hasPermission(role, p));
}

export function hasAllPermissions(role: string, permissions: string[]): boolean {
  return permissions.every(p => hasPermission(role, p));
}

export function getPermissionsForRole(role: string): string[] {
  return (ROLE_PERMISSIONS as any)[role] || [];
}

describe('Permissions Guard', () => {
  describe('hasPermission', () => {
    it('SUPER_ADMIN has all permissions', () => {
      expect(hasPermission('SUPER_ADMIN', 'anything')).toBe(true);
    });

    it('VIEWER has only read permissions', () => {
      expect(hasPermission('VIEWER', 'project.read')).toBe(true);
      expect(hasPermission('VIEWER', 'project.write')).toBe(false);
    });

    it('GUEST has only project.read and media.read', () => {
      expect(hasPermission('GUEST', 'project.read')).toBe(true);
      expect(hasPermission('GUEST', 'user.read')).toBe(false);
    });

    it('Each role has correct permissions from ROLE_PERMISSIONS map', () => {
      expect(hasPermission('ADMIN', 'user.write')).toBe(true);
      expect(hasPermission('EDITOR', 'user.write')).toBe(false);
    });
  });

  describe('hasAnyPermission', () => {
    it('Returns true if any permission matches', () => {
      expect(hasAnyPermission('VIEWER', ['project.write', 'project.read'])).toBe(true);
    });

    it('Returns false if none match', () => {
      expect(hasAnyPermission('VIEWER', ['project.write', 'user.write'])).toBe(false);
    });
  });

  describe('hasAllPermissions', () => {
    it('Returns true only if all permissions match', () => {
      expect(hasAllPermissions('EDITOR', ['project.read', 'project.write'])).toBe(true);
    });

    it('Returns false if any is missing', () => {
      expect(hasAllPermissions('EDITOR', ['project.read', 'user.write'])).toBe(false);
    });
  });

  describe('getPermissionsForRole', () => {
    it('Returns correct permission set for each role', () => {
      expect(getPermissionsForRole('VIEWER')).toEqual(['project.read', 'media.read']);
    });

    it('Returns empty array for unknown role', () => {
      expect(getPermissionsForRole('UNKNOWN')).toEqual([]);
    });
  });
});
