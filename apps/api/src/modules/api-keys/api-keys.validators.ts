import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(100),
  permissions: z.array(z.string()),
  expiresAt: z.string().datetime().optional(),
  orgId: z.string().uuid().optional(),
});
