import { z } from 'zod';

export const createOrgSchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  billingEmail: z.string().email().optional(),
});

export const updateOrgSchema = createOrgSchema.partial();

export const updateMemberRoleSchema = z.object({
  role: z.enum(['VIEWER', 'MEMBER', 'BILLING', 'ADMIN', 'OWNER']),
});

export const listMembersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
});
