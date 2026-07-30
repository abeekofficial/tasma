import { z } from 'zod';

export const updateAccountSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
  bio: z.string().max(500).optional(),
  country: z.string().length(2).optional(),
  language: z.string().optional(),
  timezone: z.string().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
});

export const updateNotificationSchema = z.object({
  emailEnabled: z.boolean().optional(),
  pushEnabled: z.boolean().optional(),
  inAppEnabled: z.boolean().optional(),
  digestFrequency: z.enum(['REALTIME', 'HOURLY', 'DAILY', 'WEEKLY', 'NEVER']).optional(),
  mutedTypes: z.array(z.string()).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1),
  confirmation: z.literal('DELETE MY ACCOUNT'),
});
