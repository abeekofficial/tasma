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

export const TrimOptionsSchema = z.object({
  startTime: z.union([z.number(), z.string()]).optional(),
  endTime: z.union([z.number(), z.string()]).optional(),
  duration: z.number().optional(),
});

export const CropOptionsSchema = z.object({
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export const ScaleOptionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  keepAspectRatio: z.boolean().optional().default(true),
});

export const OverlayOptionsSchema = z.object({
  x: z.number(),
  y: z.number(),
  opacity: z.number().optional(),
  blendMode: z.string().optional(),
});

export const ColorCorrectionOptionsSchema = z.object({
  brightness: z.number().optional(),
  contrast: z.number().optional(),
  saturation: z.number().optional(),
  gamma: z.number().optional(),
  hue: z.number().optional(),
});

export const PipelineJobConfigSchema = z.object({
  inputFiles: z.array(z.string()),
  outputFile: z.string(),
});

export type TrimOptions = z.infer<typeof TrimOptionsSchema>;
export type CropOptions = z.infer<typeof CropOptionsSchema>;
export type ScaleOptions = z.infer<typeof ScaleOptionsSchema>;
export type OverlayOptions = z.infer<typeof OverlayOptionsSchema>;
export type ColorCorrectionOptions = z.infer<typeof ColorCorrectionOptionsSchema>;
export type PipelineJobConfig = z.infer<typeof PipelineJobConfigSchema>;

export const AudioTrimOptionsSchema = z.object({
  startTime: z.union([z.number(), z.string()]).optional(),
  endTime: z.union([z.number(), z.string()]).optional(),
  duration: z.number().optional(),
});

export const FadeOptionsSchema = z.object({
  type: z.enum(['in', 'out']),
  startTime: z.number(),
  duration: z.number(),
  curve: z.string().optional(),
});

export const EqualizerOptionsSchema = z.object({
  frequency: z.number(),
  width_type: z.string().optional(),
  width: z.number().optional(),
  gain: z.number(),
});

export const CompressorOptionsSchema = z.object({
  threshold: z.number(),
  ratio: z.number(),
  attack: z.number(),
  release: z.number(),
  makeup: z.number().optional(),
});

export const NoiseGateOptionsSchema = z.object({
  threshold: z.number(),
  ratio: z.number().optional(),
  attack: z.number().optional(),
  release: z.number().optional(),
});

export type AudioTrimOptions = z.infer<typeof AudioTrimOptionsSchema>;
export type FadeOptions = z.infer<typeof FadeOptionsSchema>;
export type EqualizerOptions = z.infer<typeof EqualizerOptionsSchema>;
export type CompressorOptions = z.infer<typeof CompressorOptionsSchema>;
export type NoiseGateOptions = z.infer<typeof NoiseGateOptionsSchema>;

export const SystemResourcesSchema = z.object({
  cpuUsage: z.number(),
  memoryFree: z.number(),
  gpuUsage: z.number().optional(),
  diskFree: z.number(),
});

export const BenchmarkResultSchema = z.object({
  encodeSpeed: z.number(),
  decodeSpeed: z.number(),
  score: z.number(),
});

export type SystemResources = z.infer<typeof SystemResourcesSchema>;
export type BenchmarkResult = z.infer<typeof BenchmarkResultSchema>;
