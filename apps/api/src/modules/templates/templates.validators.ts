import { z } from 'zod';

export const createTemplateSchema = z.object({
  organizationId: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().max(1000).optional(),
  thumbnailUrl: z.string().url().optional(),
  category: z.enum(['REDDIT_STORY', 'TOP_LIST', 'PODCAST_CLIP', 'PRODUCT_SHOWCASE', 'TUTORIAL', 'NEWS', 'CUSTOM']).optional(),
  platform: z.enum(['YOUTUBE_SHORTS', 'TIKTOK', 'INSTAGRAM_REELS', 'FACEBOOK_REELS', 'CUSTOM']).optional(),
  aspectRatio: z.enum(['PORTRAIT_9_16', 'LANDSCAPE_16_9', 'SQUARE_1_1']).optional(),
  resolution: z.enum(['HD_720', 'FHD_1080', 'QHD_1440', 'UHD_4K']).optional(),
  tags: z.array(z.string()).optional(),
  timelineData: z.record(z.any()), // Validated broadly for now
  variables: z.record(z.any()),
  isPublic: z.boolean().optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const listTemplatesQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  category: z.enum(['REDDIT_STORY', 'TOP_LIST', 'PODCAST_CLIP', 'PRODUCT_SHOWCASE', 'TUTORIAL', 'NEWS', 'CUSTOM']).optional(),
  isPublic: z.string().transform((v) => v === 'true').optional(),
});
