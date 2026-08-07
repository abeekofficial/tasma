import { PrismaClient } from '@prisma/client';
import { AppError } from '@/shared/errors/app-error';
import { prisma as prismaClient } from '@/lib/prisma';
import { renderQueueRepository, RenderQueueRepository } from './render-queue.repository';
import { queueValidator, QueueValidator } from './queue-validator';
import { queueStatisticsService, QueueStatisticsService } from './queue-statistics.service';
import { queueCleanupService, QueueCleanupService } from './queue-cleanup.service';
import { queueRetryService, QueueRetryService } from './queue-retry.service';
import { queueCancellationService, QueueCancellationService } from './queue-cancellation.service';
import { queuePauseResumeService, QueuePauseResumeService } from './queue-pause-resume.service';

interface QueueHealthStatus {
  healthy: boolean;
  totalJobs: number;
  activeJobs: number;
  queuedJobs: number;
  staleJobs: number;
  failedJobs: number;
  issues: string[];
  lastCheckedAt: string;
}

interface SearchFilters {
  userId: string;
  search?: string;
  projectId?: string;
  status?: string;
  type?: string;
  priority?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/**
 * Central orchestrator for the render queue system.
 * Delegates to specialized services (retry, cancellation, pause, cleanup, statistics)
 * and provides unified queue management, health checks, and search capabilities.
 */
export class QueueManager {
  constructor(
    private readonly prisma: PrismaClient = prismaClient,
    private readonly repo: RenderQueueRepository = renderQueueRepository,
    private readonly validator: QueueValidator = queueValidator,
    private readonly statistics: QueueStatisticsService = queueStatisticsService,
    private readonly cleanup: QueueCleanupService = queueCleanupService,
    private readonly retry: QueueRetryService = queueRetryService,
    private readonly cancellation: QueueCancellationService = queueCancellationService,
    private readonly pauseResume: QueuePauseResumeService = queuePauseResumeService
  ) {}

  // ──────────────────────────────────────────────
  // Job Creation with Duplicate Prevention
  // ──────────────────────────────────────────────

  /**
   * Creates a render job after checking for duplicate active jobs.
   */
  public async createJob(userId: string, data: any) {
    // Check for duplicate active jobs
    const activeJobs = await this.prisma.renderJob.findMany({
      where: {
        userId,
        projectId: data.projectId,
        status: { notIn: ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'] },
      },
      select: { type: true, status: true, projectId: true },
    });

    if (this.validator.isDuplicateJobCandidate(activeJobs, data.type, data.projectId)) {
      throw AppError.conflict(
        `An active ${data.type} job already exists for this project. ` +
        `Cancel or wait for the existing job to complete.`
      );
    }

    // Delegate to the foundation service for actual creation
    // (imported as renderQueueService in the controller)
    // Here we perform the creation directly for independence
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
          message: `Render job created: ${data.type} [${data.priority || 'NORMAL'}]`,
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

  // ──────────────────────────────────────────────
  // Job Lookup & Search
  // ──────────────────────────────────────────────

  /**
   * Advanced search across render jobs with text search and date range filtering.
   */
  public async searchJobs(
    filters: SearchFilters,
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const where: any = { userId: filters.userId };

    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.priority) where.priority = filters.priority;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }

    if (filters.search) {
      where.OR = [
        { project: { name: { contains: filters.search, mode: 'insensitive' } } },
        { errorMessage: { contains: filters.search, mode: 'insensitive' } },
        { workerId: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.renderJob.findMany({
        where,
        include: { project: { select: { id: true, name: true, slug: true } } },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.renderJob.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Returns a single job by ID with ownership verification.
   */
  public async getJob(jobId: string, userId: string) {
    const job = await this.repo.findById(jobId);

    if (!job) {
      throw AppError.notFound('Render job');
    }

    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied to this render job');
    }

    return job;
  }

  // ──────────────────────────────────────────────
  // Status Update with Validation
  // ──────────────────────────────────────────────

  /**
   * Updates job status with transition validation.
   */
  public async updateJobStatus(jobId: string, userId: string, statusData: any) {
    const job = await this.getJob(jobId, userId);

    // Validate the status transition
    this.validator.validateStatusTransition(job.status, statusData.status);

    const updatePayload: any = { status: statusData.status };

    if (statusData.progress !== undefined) updatePayload.progress = statusData.progress;
    if (statusData.workerId !== undefined) updatePayload.workerId = statusData.workerId;
    if (statusData.errorMessage !== undefined) updatePayload.errorMessage = statusData.errorMessage;
    if (statusData.errorCode !== undefined) updatePayload.errorCode = statusData.errorCode;

    if (statusData.status === 'PROCESSING' && !job.startedAt) {
      updatePayload.startedAt = new Date();
    }
    if (this.validator.isTerminalStatus(statusData.status)) {
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
          message: `Status: ${job.status} → ${statusData.status}`,
          data: { previousStatus: job.status, newStatus: statusData.status, progress: statusData.progress },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  // ──────────────────────────────────────────────
  // Priority Management
  // ──────────────────────────────────────────────

  /**
   * Updates the priority of a queued or assigned job.
   */
  public async updateJobPriority(jobId: string, userId: string, newPriority: string) {
    const job = await this.getJob(jobId, userId);

    if (!['QUEUED', 'ASSIGNED'].includes(job.status)) {
      throw AppError.conflict(
        `Cannot change priority of a job with status ${job.status}. Only QUEUED or ASSIGNED jobs.`
      );
    }

    this.validator.validatePriorityChange(job.priority, newPriority);

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: { priority: newPriority as any },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: `Priority changed: ${job.priority} → ${newPriority}`,
          data: { previousPriority: job.priority, newPriority },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  // ──────────────────────────────────────────────
  // Queue Health Check
  // ──────────────────────────────────────────────

  /**
   * Performs a comprehensive health check on the user's render queue.
   */
  public async healthCheck(userId: string): Promise<QueueHealthStatus> {
    const issues: string[] = [];

    const [statusCounts, staleJobs] = await Promise.all([
      this.repo.countByStatus(userId),
      this.cleanup.detectStaleJobs(userId, 60),
    ]);

    const totalJobs = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const activeStatuses = ['ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'];
    const activeJobs = activeStatuses.reduce((sum, s) => sum + (statusCounts[s] || 0), 0);
    const queuedJobs = statusCounts['QUEUED'] || 0;
    const failedJobs = statusCounts['FAILED'] || 0;

    if (staleJobs.length > 0) {
      issues.push(`${staleJobs.length} stale job(s) detected (inactive for >60 minutes)`);
    }

    if (failedJobs > 10) {
      issues.push(`High failure count: ${failedJobs} failed jobs in queue`);
    }

    if (queuedJobs > 50) {
      issues.push(`Queue backlog: ${queuedJobs} jobs waiting`);
    }

    return {
      healthy: issues.length === 0,
      totalJobs,
      activeJobs,
      queuedJobs,
      staleJobs: staleJobs.length,
      failedJobs,
      issues,
      lastCheckedAt: new Date().toISOString(),
    };
  }

  // ──────────────────────────────────────────────
  // Delegated Operations
  // ──────────────────────────────────────────────

  /** Delegates to QueueStatisticsService */
  public getQueueOverview(userId: string) {
    return this.statistics.getQueueOverview(userId);
  }

  /** Delegates to QueueStatisticsService */
  public getQueueTrends(userId: string, days?: number) {
    return this.statistics.getQueueTrends(userId, days);
  }

  /** Delegates to QueueStatisticsService */
  public estimateWaitTime(userId: string, priority: string) {
    return this.statistics.estimateWaitTime(userId, priority);
  }

  /** Delegates to QueueRetryService */
  public retryJob(jobId: string, userId: string, options: any) {
    return this.retry.retryJob(jobId, userId, options);
  }

  /** Delegates to QueueRetryService */
  public batchRetry(jobIds: string[], userId: string, options: any) {
    return this.retry.batchRetry(jobIds, userId, options);
  }

  /** Delegates to QueueRetryService */
  public autoRetryFailedJobs(userId: string) {
    return this.retry.autoRetryFailedJobs(userId);
  }

  /** Delegates to QueueCancellationService */
  public cancelJob(jobId: string, userId: string, reason?: string) {
    return this.cancellation.cancelJob(jobId, userId, reason);
  }

  /** Delegates to QueueCancellationService */
  public batchCancel(jobIds: string[], userId: string, reason?: string) {
    return this.cancellation.batchCancel(jobIds, userId, reason);
  }

  /** Delegates to QueueCancellationService */
  public cancelAllForProject(projectId: string, userId: string, reason?: string) {
    return this.cancellation.cancelAllForProject(projectId, userId, reason);
  }

  /** Delegates to QueuePauseResumeService */
  public pauseJob(jobId: string, userId: string, reason?: string) {
    return this.pauseResume.pauseJob(jobId, userId, reason);
  }

  /** Delegates to QueuePauseResumeService */
  public resumeJob(jobId: string, userId: string) {
    return this.pauseResume.resumeJob(jobId, userId);
  }

  /** Delegates to QueuePauseResumeService */
  public batchPause(jobIds: string[], userId: string, reason?: string) {
    return this.pauseResume.batchPause(jobIds, userId, reason);
  }

  /** Delegates to QueuePauseResumeService */
  public batchResume(jobIds: string[], userId: string) {
    return this.pauseResume.batchResume(jobIds, userId);
  }

  /** Delegates to QueueCleanupService */
  public cleanupCompletedJobs(userId: string, options?: any) {
    return this.cleanup.cleanupCompletedJobs(userId, options);
  }

  /** Delegates to QueueCleanupService */
  public timeoutStaleJobs(userId: string, timeoutMinutes?: number) {
    return this.cleanup.timeoutStaleJobs(userId, timeoutMinutes);
  }

  /** Delegates to QueueCleanupService */
  public getCleanupPreview(userId: string, olderThanDays?: number) {
    return this.cleanup.getCleanupPreview(userId, olderThanDays);
  }
}

export const queueManager = new QueueManager();
