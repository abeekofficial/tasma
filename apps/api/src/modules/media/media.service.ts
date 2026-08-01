import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { mediaRepository, MediaRepository } from './media.repository';
import { prisma as prismaClient } from '@/lib/prisma';

export class MediaService {
  constructor(
    private readonly repo: MediaRepository = mediaRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async getUploadUrl(userId: string, data: any) {
    // Validate workspace access
    const hasWorkspaceAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: data.workspaceId, userId }
    });

    if (!hasWorkspaceAccess) {
       throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this workspace');
    }

    // In a real implementation, generate a pre-signed URL for R2/S3
    // Here we stub it and create the DB record in UPLOADING state
    const storageKey = `workspaces/${data.workspaceId}/${Date.now()}_${data.originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    const mediaAsset = await this.repo.create({
      workspaceId: data.workspaceId,
      uploadedById: userId,
      type: data.type,
      name: data.name,
      originalFilename: data.originalFilename,
      mimeType: data.mimeType,
      size: data.size,
      storageKey,
      storageProvider: 'CLOUDFLARE_R2', // Default
      status: 'UPLOADING',
      tags: data.tags || [],
    });

    return {
      mediaAsset,
      uploadUrl: `https://mock-s3-upload-url.com/${storageKey}`, // Mock pre-signed URL
      uploadMethod: 'PUT',
    };
  }

  public async getMedia(mediaId: string, userId: string) {
    const media = await this.repo.findById(mediaId);
    if (!media || media.deletedAt) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Media not found');
    }

    const hasWorkspaceAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: media.workspaceId, userId }
    });

    if (!hasWorkspaceAccess && !media.isPublic) {
       throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this media asset');
    }

    return media;
  }

  public async listMedia(workspaceId: string, userId: string, page: number, limit: number, filters?: { search?: string; type?: string }) {
    const hasWorkspaceAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId }
    });

    if (!hasWorkspaceAccess) {
       throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this workspace');
    }

    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findMany(workspaceId, { skip, take: limit }, filters);
    return { data, total, page, limit };
  }

  public async updateMedia(mediaId: string, data: any, actorId: string) {
    const media = await this.getMedia(mediaId, actorId); // getMedia checks workspace access
    
    const updated = await this.repo.update(mediaId, data);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'MEDIA_UPDATED',
        userId: actorId,
        metadata: { mediaId, updates: data },
      },
    });

    return updated;
  }

  public async deleteMedia(mediaId: string, actorId: string) {
    await this.getMedia(mediaId, actorId); // Verify access
    await this.repo.softDelete(mediaId);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'MEDIA_DELETED',
        userId: actorId,
        metadata: { mediaId },
      },
    });
  }
}

export const mediaService = new MediaService();
