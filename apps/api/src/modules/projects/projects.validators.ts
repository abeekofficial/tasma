import { z } from 'zod';

export const createProjectSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  thumbnailUrl: z.string().url().optional(),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PRIVATE', 'TEAM', 'ORGANIZATION', 'PUBLIC']).optional(),
  platform: z.enum(['YOUTUBE_SHORTS', 'TIKTOK', 'INSTAGRAM_REELS', 'FACEBOOK_REELS', 'CUSTOM']).optional(),
  aspectRatio: z.enum(['PORTRAIT_9_16', 'LANDSCAPE_16_9', 'SQUARE_1_1']).optional(),
  resolution: z.enum(['HD_720', 'FHD_1080', 'QHD_1440', 'UHD_4K']).optional(),
  fps: z.number().int().min(1).max(120).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  workspaceId: z.string().uuid().optional(),
});

export const listProjectsQuerySchema = z.object({
  workspaceId: z.string().uuid(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
});
