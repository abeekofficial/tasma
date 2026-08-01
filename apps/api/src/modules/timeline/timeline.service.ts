import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { timelineRepository, TimelineRepository } from './timeline.repository';
import { prisma as prismaClient } from '@/lib/prisma';

export class TimelineService {
  constructor(
    private readonly repo: TimelineRepository = timelineRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async checkProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { collaborators: true }
    });

    if (!project || project.deletedAt) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Project not found');
    }

    // Checking if user has workspace access or is a collaborator
    const hasWorkspaceAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: project.workspaceId, userId }
    });

    if (!hasWorkspaceAccess) {
       throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this project');
    }

    return project;
  }

  public async getTimeline(projectId: string, userId: string) {
    await this.checkProjectAccess(projectId, userId);
    
    const timeline = await this.repo.findByProjectId(projectId);
    if (!timeline) {
       throw new AppError(ERROR_CODES.NOT_FOUND, 'Timeline not initialized for this project');
    }

    return timeline;
  }

  public async createTimeline(userId: string, data: any) {
    await this.checkProjectAccess(data.projectId, userId);

    const existing = await this.repo.findByProjectId(data.projectId);
    if (existing) {
       throw new AppError(ERROR_CODES.CONFLICT, 'Timeline already exists for this project');
    }

    return this.repo.create(data);
  }

  public async updateTimeline(projectId: string, data: any, actorId: string) {
    await this.checkProjectAccess(projectId, actorId);
    
    const timeline = await this.repo.findByProjectId(projectId);
    if (!timeline) {
       throw new AppError(ERROR_CODES.NOT_FOUND, 'Timeline not found');
    }

    return this.repo.update(projectId, data);
  }

  public async syncTimeline(projectId: string, data: any, actorId: string) {
    await this.checkProjectAccess(projectId, actorId);
    
    const timeline = await this.repo.findByProjectId(projectId);
    if (!timeline) {
       throw new AppError(ERROR_CODES.NOT_FOUND, 'Timeline not found');
    }

    // Using the repository's sync method
    const synced = await this.repo.syncFullTimeline(projectId, data.tracks, data.duration);

    await this.prisma.auditLog.create({
      data: {
        action: 'TIMELINE_SYNCED',
        userId: actorId,
        metadata: { projectId, version: synced.version },
      },
    });

    return synced;
  }
}

export const timelineService = new TimelineService();
