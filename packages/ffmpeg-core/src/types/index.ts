import { z } from 'zod';

export const SilenceIntervalSchema = z.object({
  start: z.number(),
  end: z.number(),
});

export const VideoAnalysisSchema = z.object({
  isVFR: z.boolean(),
  colorRange: z.string().optional(),
  keyframeInterval: z.number().optional(),
  pixelFormat: z.string().optional(),
  hdrMetadata: z.record(z.any()).optional(),
});

export const AudioAnalysisSchema = z.object({
  peakLevel: z.number().optional(),
  lufs: z.number().optional(),
  silenceIntervals: z.array(SilenceIntervalSchema).default([]),
});

export const ImageAnalysisSchema = z.object({
  exif: z.record(z.any()).optional(),
  hasAlpha: z.boolean(),
  colorProfile: z.string().optional(),
});

export const QualityAnalysisSchema = z.object({
  blurScore: z.number().optional(),
  noiseLevel: z.number().optional(),
  ssimEstimate: z.number().optional(),
});

export const MetadataCacheEntrySchema = z.object({
  timestamp: z.number(),
  expiresAt: z.number().optional(),
  data: z.any(),
});

export type SilenceInterval = z.infer<typeof SilenceIntervalSchema>;
export type VideoAnalysis = z.infer<typeof VideoAnalysisSchema>;
export type AudioAnalysis = z.infer<typeof AudioAnalysisSchema>;
export type ImageAnalysis = z.infer<typeof ImageAnalysisSchema>;
export type QualityAnalysis = z.infer<typeof QualityAnalysisSchema>;
export type MetadataCacheEntry = z.infer<typeof MetadataCacheEntrySchema>;
