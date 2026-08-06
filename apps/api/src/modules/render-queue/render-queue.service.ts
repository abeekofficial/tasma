import { PrismaClient } from '@prisma/client';
import { AppError } from '@/shared/errors/app-error';
import { renderQueueRepository, RenderQueueRepository } from './render-queue.repository';
import { prisma as prismaClient } from '@/lib/prisma';

const TERMINAL_STATUSES = ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'];
const CANCELLABLE_STATUSES = ['QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'];
const PAUSABLE_STATUSES = ['QUEUED', 'ASSIGNED'];
const RESUMABLE_STATUSES = ['CANCELLED'];

export class RenderQueueService {
  constructor(
    private readonly repo: RenderQueueRepository = renderQueueRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async createRenderJob(userId: string, data: any) {
    // Verify project exists and user has access
    const project = await this.prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw AppError.notFound('Project');
    }

    const hasAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: project.workspaceId, userId },
    });

    if (!hasAccess) {
      throw AppError.forbidden('Access denied to this project');
    }

    const renderJob = await this.prisma.$transaction(async (tx) => {
      const job = await tx.renderJob.create({
        data: {
          projectId: data.projectId,
          userId,
          type: data.type,
          status: 'QUEUED',
          priority: data.priority || 'NORMAL',
          format: data.format || 'MP4',
          resolution: data.resolution || 'FHD_1080',
          fps: data.fps || 30,
          quality: data.quality || 'STANDARD',
          codec: data.codec || 'H264',
          bitrate: data.bitrate || null,
          maxRetries: data.maxRetries ?? 3,
          metadata: data.metadata || null,
        },
        include: { project: { select: { id: true, name: true, slug: true } } },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: job.id,
          level: 'INFO',
          message: `Render job created with type ${data.type} and priority ${data.priority || 'NORMAL'}`,
          data: { createdBy: userId, format: data.format, resolution: data.resolution },
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'RENDER_JOB_CREATED',
          userId,
          metadata: { renderJobId: job.id, projectId: data.projectId, type: data.type },
        },
      });

      return job;
    });

    return renderJob;
  }

  public async getRenderJob(jobId: string, userId: string) {
    const job = await this.repo.findById(jobId);

    if (!job) {
      throw AppError.notFound('Render job');
    }

    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied to this render job');
    }

    return job;
  }

  public async listRenderJobs(
    userId: string,
    filters: { projectId?: string; status?: string; type?: string; priority?: string },
    page: number,
    limit: number,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findMany(
      { userId, ...filters },
      { skip, take: limit },
      { field: sortBy, order: sortOrder }
    );

    return { data, total, page, limit };
  }

  public async updateJobStatus(jobId: string, userId: string, statusData: any) {
    const job = await this.getRenderJob(jobId, userId);

    const updatePayload: any = { status: statusData.status };

    if (statusData.progress !== undefined) updatePayload.progress = statusData.progress;
    if (statusData.workerId !== undefined) updatePayload.workerId = statusData.workerId;
    if (statusData.errorMessage !== undefined) updatePayload.errorMessage = statusData.errorMessage;
    if (statusData.errorCode !== undefined) updatePayload.errorCode = statusData.errorCode;

    // Set timestamps based on status transitions
    if (statusData.status === 'PROCESSING' && !job.startedAt) {
      updatePayload.startedAt = new Date();
    }
    if (TERMINAL_STATUSES.includes(statusData.status)) {
      updatePayload.completedAt = new Date();
      if (job.startedAt) {
        updatePayload.actualDuration = (Date.now() - job.startedAt.getTime()) / 1000;
      }
    }
    if (statusData.status === 'COMPLETED') {
      updatePayload.progress = 100;
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: updatePayload,
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: statusData.status === 'FAILED' ? 'ERROR' : 'INFO',
          message: `Job status changed from ${job.status} to ${statusData.status}`,
          data: { previousStatus: job.status, newStatus: statusData.status, progress: statusData.progress },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  public async deleteRenderJob(jobId: string, userId: string) {
    const job = await this.getRenderJob(jobId, userId);

    if (!TERMINAL_STATUSES.includes(job.status) && job.status !== 'QUEUED') {
      throw AppError.conflict('Cannot delete an active render job. Cancel it first.');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.renderJob.delete({ where: { id: jobId } });

      await tx.auditLog.create({
        data: {
          action: 'RENDER_JOB_DELETED',
          userId,
          metadata: { renderJobId: jobId, projectId: job.projectId },
        },
      });
    });
  }

  public async retryRenderJob(jobId: string, userId: string, options: { resetProgress?: boolean; priority?: string }) {
    const job = await this.getRenderJob(jobId, userId);

    if (!TERMINAL_STATUSES.includes(job.status)) {
      throw AppError.conflict('Can only retry jobs that have finished (COMPLETED, FAILED, CANCELLED, TIMED_OUT)');
    }

    if (job.retryCount >= job.maxRetries) {
      throw AppError.conflict(`Maximum retry count (${job.maxRetries}) reached for this job`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'QUEUED',
          progress: options.resetProgress !== false ? 0 : job.progress,
          retryCount: { increment: 1 },
          priority: (options.priority as any) || job.priority,
          errorMessage: null,
          errorCode: null,
          startedAt: null,
          completedAt: null,
          actualDuration: null,
          workerId: null,
        },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: `Job retried (attempt ${updatedJob.retryCount} of ${updatedJob.maxRetries})`,
          data: { previousStatus: job.status, retryCount: updatedJob.retryCount },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  public async cancelRenderJob(jobId: string, userId: string) {
    const job = await this.getRenderJob(jobId, userId);

    if (!CANCELLABLE_STATUSES.includes(job.status)) {
      throw AppError.conflict(`Cannot cancel a job with status ${job.status}`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'CANCELLED',
          completedAt: new Date(),
          actualDuration: job.startedAt ? (Date.now() - job.startedAt.getTime()) / 1000 : null,
        },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'WARN',
          message: `Job cancelled by user`,
          data: { previousStatus: job.status, cancelledBy: userId },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  public async pauseRenderJob(jobId: string, userId: string) {
    const job = await this.getRenderJob(jobId, userId);

    if (!PAUSABLE_STATUSES.includes(job.status)) {
      throw AppError.conflict(`Cannot pause a job with status ${job.status}. Only QUEUED or ASSIGNED jobs can be paused.`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: { status: 'CANCELLED' },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: `Job paused by user (status set to CANCELLED for re-queue)`,
          data: { previousStatus: job.status, pausedBy: userId },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  public async resumeRenderJob(jobId: string, userId: string) {
    const job = await this.getRenderJob(jobId, userId);

    if (!RESUMABLE_STATUSES.includes(job.status)) {
      throw AppError.conflict(`Cannot resume a job with status ${job.status}. Only CANCELLED jobs can be resumed.`);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: { status: 'QUEUED' },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: `Job resumed by user`,
          data: { previousStatus: job.status, resumedBy: userId },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  public async getJobLogs(jobId: string, userId: string) {
    await this.getRenderJob(jobId, userId);
    return this.repo.findLogsByJobId(jobId);
  }

  public async getQueueStats(userId: string) {
    return this.repo.countByStatus(userId);
  }
}

export const renderQueueService = new RenderQueueService();
