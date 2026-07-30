import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../errors/app-error';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../../config/env';

export const ALLOWED_MIME_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif'],
  videos: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac', 'audio/webm'],
  fonts: ['font/ttf', 'font/otf', 'font/woff', 'font/woff2'],
  documents: ['application/pdf'],
};

export const MAX_FILE_SIZES = {
  images: 10 * 1024 * 1024, // 10MB
  videos: 2 * 1024 * 1024 * 1024, // 2GB
  audio: 500 * 1024 * 1024, // 500MB
  fonts: 10 * 1024 * 1024, // 10MB
  documents: 50 * 1024 * 1024, // 50MB
};

/**
 * Check if MIME type is allowed
 */
export function validateFileType(mimeType: string, category?: keyof typeof ALLOWED_MIME_TYPES): boolean {
  if (category) {
    return ALLOWED_MIME_TYPES[category].includes(mimeType);
  }
  return Object.values(ALLOWED_MIME_TYPES).flat().includes(mimeType);
}

/**
 * Get max file size for a given MIME type
 */
export function getMaxFileSize(mimeType: string): number {
  if (ALLOWED_MIME_TYPES.images.includes(mimeType)) return MAX_FILE_SIZES.images;
  if (ALLOWED_MIME_TYPES.videos.includes(mimeType)) return MAX_FILE_SIZES.videos;
  if (ALLOWED_MIME_TYPES.audio.includes(mimeType)) return MAX_FILE_SIZES.audio;
  if (ALLOWED_MIME_TYPES.fonts.includes(mimeType)) return MAX_FILE_SIZES.fonts;
  if (ALLOWED_MIME_TYPES.documents.includes(mimeType)) return MAX_FILE_SIZES.documents;
  return 5 * 1024 * 1024; // Default 5MB fallback
}

/**
 * Express middleware using multer for file uploads
 */
export const validateUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (validateFileType(file.mimetype)) {
      cb(null, true);
    } else {
      cb(AppError.badRequest('Invalid file type') as any);
    }
  },
  limits: {
    // Dynamic max file size is complex with multer limits since it's checked before reading the file,
    // so we set a safe maximum limit here and we can validate exact limits per file type after upload
    fileSize: MAX_FILE_SIZES.videos,
  },
});

const s3Client = new S3Client({
  region: 'auto',
  endpoint: env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_KEY,
  },
});

/**
 * Generate a presigned PUT URL for client-side direct uploads to Cloudflare R2
 */
export async function generateSignedUploadUrl(storageKey: string, contentType: string, contentLength: number): Promise<string> {
  const maxAllowedSize = getMaxFileSize(contentType);
  if (contentLength > maxAllowedSize) {
    throw AppError.badRequest(`File size exceeds maximum allowed for ${contentType}`);
  }

  const command = new PutObjectCommand({
    Bucket: env.CLOUDFLARE_R2_BUCKET,
    Key: storageKey,
    ContentType: contentType,
    ContentLength: contentLength,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 900 }); // 15 minutes
}
