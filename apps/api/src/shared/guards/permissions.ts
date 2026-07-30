export const PERMISSIONS = {
  USER: ['user.read', 'user.update', 'user.delete', 'user.list', 'user.manage'],
  ORG: ['org.read', 'org.update', 'org.delete', 'org.invite', 'org.manage_members', 'org.manage_billing', 'org.manage_settings'],
  TEAM: ['team.create', 'team.read', 'team.update', 'team.delete', 'team.manage_members'],
  WORKSPACE: ['workspace.create', 'workspace.read', 'workspace.update', 'workspace.delete', 'workspace.manage'],
  PROJECT: ['project.create', 'project.read', 'project.update', 'project.delete', 'project.publish', 'project.share', 'project.manage_collaborators', 'project.export', 'project.render'],
  MEDIA: ['media.upload', 'media.read', 'media.update', 'media.delete', 'media.manage'],
  AI: ['ai.generate_script', 'ai.generate_voice', 'ai.generate_image', 'ai.generate_video', 'ai.generate_subtitles', 'ai.manage_prompts'],
  RENDER: ['render.create', 'render.read', 'render.cancel', 'render.manage'],
  BILLING: ['billing.read', 'billing.manage_subscription', 'billing.manage_payment_methods', 'billing.view_invoices'],
  SYSTEM: ['system.manage_users', 'system.manage_settings', 'system.manage_feature_flags', 'system.view_logs', 'system.manage_all'],
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS).flat();
const NON_SYSTEM_PERMISSIONS = ALL_PERMISSIONS.filter(p => !p.startsWith('system.'));
const NON_SYSTEM_NON_BILLING_PERMISSIONS = NON_SYSTEM_PERMISSIONS.filter(p => !p.startsWith('billing.manage'));

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  ADMIN: ALL_PERMISSIONS.filter(p => p !== 'system.manage_all'),
  SUPPORT: ['user.read', 'user.list', 'org.read', 'team.read', 'project.read', 'system.view_logs'],
  MODERATOR: ['user.read', 'user.list', 'user.manage', 'org.read', 'project.read', 'project.update', 'media.read', 'media.manage'],
  CREATOR: ['project.create', 'project.read', 'project.update', 'project.export', 'project.render', 'media.upload', 'media.read', 'media.update', 'ai.generate_script', 'ai.generate_voice', 'ai.generate_image', 'ai.generate_video', 'ai.generate_subtitles', 'render.create', 'render.read'],
  PREMIUM: ['project.create', 'project.read', 'project.update', 'project.export', 'project.render', 'media.upload', 'media.read', 'media.update', 'ai.generate_script', 'ai.generate_voice', 'ai.generate_image', 'ai.generate_video', 'ai.generate_subtitles', 'render.create', 'render.read', 'project.publish', 'project.share', 'ai.manage_prompts', 'render.manage'],
  USER: ['project.create', 'project.read', 'project.update', 'media.upload', 'media.read', 'ai.generate_script', 'ai.generate_subtitles', 'render.create', 'render.read'],
  GUEST: ['project.read', 'media.read'],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission) || perms.includes('*') || role === 'SUPER_ADMIN';
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: string, permissions: string[]): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (role === 'SUPER_ADMIN') return true;
  return permissions.some(p => perms.includes(p));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: string, permissions: string[]): boolean {
  const perms = ROLE_PERMISSIONS[role] || [];
  if (role === 'SUPER_ADMIN') return true;
  return permissions.every(p => perms.includes(p));
}

/**
 * Get all permissions for a specific role
 */
export function getPermissionsForRole(role: string): string[] {
  return ROLE_PERMISSIONS[role] || [];
}
