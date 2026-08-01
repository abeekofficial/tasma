import { z } from 'zod';

export const getMediaUploadUrlSchema = z.object({
  workspaceId: z.string().uuid(),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'FONT', 'DOCUMENT', 'OTHER']),
  name: z.string().min(1).max(255),
  originalFilename: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  size: z.number().int().positive(),
  tags: z.array(z.string()).optional(),
});

export const updateMediaSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

export const listMediaQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  type: z.enum(['IMAGE', 'VIDEO', 'AUDIO', 'FONT', 'DOCUMENT', 'OTHER']).optional(),
});
