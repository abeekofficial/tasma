import { z } from 'zod';

export const createTimelineSchema = z.object({
  projectId: z.string().uuid(),
  duration: z.number().min(0).optional(),
  fps: z.number().int().min(1).max(120).optional(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  backgroundColor: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export const updateTimelineSchema = z.object({
  duration: z.number().min(0).optional(),
  fps: z.number().int().min(1).max(120).optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  backgroundColor: z.string().optional(),
  settings: z.record(z.any()).optional(),
});

export const syncTimelineSchema = z.object({
  tracks: z.array(z.any()),
  transitions: z.array(z.any()).optional(),
  duration: z.number().min(0).optional(),
});
