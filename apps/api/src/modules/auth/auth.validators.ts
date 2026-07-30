import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain uppercase, lowercase, number, and special character'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional().default(false),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: registerSchema.shape.password,
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const enableTwoFactorSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});
export type EnableTwoFactorInput = z.infer<typeof enableTwoFactorSchema>;

export const verifyTwoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be exactly 6 characters').regex(/^\d{6}$/, 'Code must contain only digits'),
});
export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>;

export const disableTwoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be exactly 6 characters').regex(/^\d{6}$/, 'Code must contain only digits'),
  password: z.string().min(1, 'Password is required'),
});
export type DisableTwoFactorInput = z.infer<typeof disableTwoFactorSchema>;
