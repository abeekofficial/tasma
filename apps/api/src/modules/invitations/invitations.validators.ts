import { z } from 'zod';

export const createInviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['VIEWER', 'MEMBER', 'BILLING', 'ADMIN']),
});
