import { z } from 'zod';

export const createRenderJobSchema = z.object({
  projectId: z.string().uuid(),
  type: z.enum(['PREVIEW', 'EXPORT', 'THUMBNAIL', 'SOCIAL_PUBLISH']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional().default('NORMAL'),
  format: z.enum(['MP4', 'WEBM', 'MOV', 'GIF']).optional().default('MP4'),
  resolution: z.enum(['HD_720', 'FHD_1080', 'QHD_1440', 'UHD_4K']).optional().default('FHD_1080'),
  fps: z.number().int().min(1).max(120).optional().default(30),
  quality: z.enum(['DRAFT', 'STANDARD', 'HIGH', 'ULTRA']).optional().default('STANDARD'),
  codec: z.enum(['H264', 'H265', 'VP9', 'AV1']).optional().default('H264'),
  bitrate: z.number().int().positive().optional(),
  maxRetries: z.number().int().min(0).max(10).optional().default(3),
  metadata: z.record(z.unknown()).optional(),
});

export const updateRenderJobStatusSchema = z.object({
  status: z.enum([
    'QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING',
    'UPLOADING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT',
  ]),
  progress: z.number().min(0).max(100).optional(),
  workerId: z.string().optional(),
  errorMessage: z.string().max(2000).optional(),
  errorCode: z.string().max(100).optional(),
});

export const listRenderJobsQuerySchema = z.object({
  projectId: z.string().uuid().optional(),
  status: z.enum([
    'QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING',
    'UPLOADING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT',
  ]).optional(),
  type: z.enum(['PREVIEW', 'EXPORT', 'THUMBNAIL', 'SOCIAL_PUBLISH']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const retryRenderJobSchema = z.object({
  resetProgress: z.boolean().optional().default(true),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

export const batchJobIdsSchema = z.object({
  jobIds: z.array(z.string().uuid()).min(1).max(100),
  reason: z.string().max(500).optional(),
});

export const batchRetrySchema = z.object({
  jobIds: z.array(z.string().uuid()).min(1).max(100),
  resetProgress: z.boolean().optional().default(true),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
});

export const searchRenderJobsSchema = z.object({
  search: z.string().optional(),
  projectId: z.string().uuid().optional(),
  status: z.enum([
    'QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING',
    'UPLOADING', 'COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT',
  ]).optional(),
  type: z.enum(['PREVIEW', 'EXPORT', 'THUMBNAIL', 'SOCIAL_PUBLISH']).optional(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const updatePrioritySchema = z.object({
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']),
});

export const cleanupSchema = z.object({
  olderThanDays: z.number().int().min(1).max(365).optional().default(30),
  statuses: z.array(z.enum(['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'])).optional(),
  dryRun: z.boolean().optional().default(false),
  limit: z.number().int().min(1).max(1000).optional().default(500),
});

export const projectActionSchema = z.object({
  projectId: z.string().uuid(),
  reason: z.string().max(500).optional(),
});

export const trendsQuerySchema = z.object({
  days: z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(365)).optional(),
});

export const waitTimeQuerySchema = z.object({
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional().default('NORMAL'),
});
