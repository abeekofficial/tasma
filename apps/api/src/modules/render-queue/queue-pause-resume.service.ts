import { PrismaClient } from '@prisma/client';
import { AppError } from '@/shared/errors/app-error';
import { prisma as prismaClient } from '@/lib/prisma';
import { queueValidator, QueueValidator } from './queue-validator';

interface BatchPauseResumeResult {
  succeeded: string[];
  failed: Array<{ jobId: string; error: string }>;
  skipped: string[];
}

/**
 * Handles pause and resume operations for the render queue.
 * Supports single job, batch, and project-wide pause/resume.
 */
export class QueuePauseResumeService {
  constructor(
    private readonly prisma: PrismaClient = prismaClient,
    private readonly validator: QueueValidator = queueValidator
  ) {}

  /**
   * Pauses a single render job.
   */
  public async pauseJob(jobId: string, userId: string, reason?: string) {
    const job = await this.prisma.renderJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw AppError.notFound('Render job');
    }

    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied to this render job');
    }

    this.validator.validatePause(job.status);

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'CANCELLED',
          metadata: {
            ...(typeof job.metadata === 'object' && job.metadata !== null ? job.metadata as Record<string, unknown> : {}),
            pausedAt: new Date().toISOString(),
            pausedFromStatus: job.status,
            pauseReason: reason || null,
          },
        },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: reason ? `Job paused: ${reason}` : 'Job paused by user',
          data: { previousStatus: job.status, pausedBy: userId, reason: reason || null },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  /**
   * Resumes a previously paused render job.
   */
  public async resumeJob(jobId: string, userId: string) {
    const job = await this.prisma.renderJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw AppError.notFound('Render job');
    }

    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied to this render job');
    }

    this.validator.validateResume(job.status);

    const metadata = typeof job.metadata === 'object' && job.metadata !== null
      ? job.metadata as Record<string, unknown>
      : {};

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'QUEUED',
          metadata: {
            ...metadata,
            resumedAt: new Date().toISOString(),
            pausedAt: undefined,
            pausedFromStatus: undefined,
            pauseReason: undefined,
          },
        },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: 'Job resumed by user',
          data: { previousStatus: job.status, resumedBy: userId },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  /**
   * Pauses multiple jobs at once.
   */
  public async batchPause(
    jobIds: string[],
    userId: string,
    reason?: string
  ): Promise<BatchPauseResumeResult> {
    const succeeded: string[] = [];
    const failed: Array<{ jobId: string; error: string }> = [];
    const skipped: string[] = [];

    const jobs = await this.prisma.renderJob.findMany({
      where: { id: { in: jobIds }, userId },
    });

    const foundIds = new Set(jobs.map((j) => j.id));
    for (const id of jobIds) {
      if (!foundIds.has(id)) skipped.push(id);
    }

    for (const job of jobs) {
      try {
        this.validator.validatePause(job.status);

        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: {
              status: 'CANCELLED',
              metadata: {
                ...(typeof job.metadata === 'object' && job.metadata !== null ? job.metadata as Record<string, unknown> : {}),
                pausedAt: new Date().toISOString(),
                pausedFromStatus: job.status,
                pauseReason: reason || null,
              },
            },
          });

          await tx.renderJobLog.create({
            data: {
              renderJobId: job.id,
              level: 'INFO',
              message: 'Job paused via batch operation',
              data: { previousStatus: job.status, batchOperation: true, reason: reason || null },
            },
          });
        });

        succeeded.push(job.id);
      } catch (error: any) {
        failed.push({ jobId: job.id, error: error.message });
      }
    }

    if (succeeded.length > 0) {
      await this.prisma.auditLog.create({
        data: {
          action: 'RENDER_JOBS_BATCH_PAUSED',
          userId,
          metadata: { succeededCount: succeeded.length, failedCount: failed.length, reason: reason || null },
        },
      });
    }

    return { succeeded, failed, skipped };
  }

  /**
   * Resumes multiple jobs at once.
   */
  public async batchResume(
    jobIds: string[],
    userId: string
  ): Promise<BatchPauseResumeResult> {
    const succeeded: string[] = [];
    const failed: Array<{ jobId: string; error: string }> = [];
    const skipped: string[] = [];

    const jobs = await this.prisma.renderJob.findMany({
      where: { id: { in: jobIds }, userId },
    });

    const foundIds = new Set(jobs.map((j) => j.id));
    for (const id of jobIds) {
      if (!foundIds.has(id)) skipped.push(id);
    }

    for (const job of jobs) {
      try {
        this.validator.validateResume(job.status);

        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: { status: 'QUEUED' },
          });

          await tx.renderJobLog.create({
            data: {
              renderJobId: job.id,
              level: 'INFO',
              message: 'Job resumed via batch operation',
              data: { previousStatus: job.status, batchOperation: true },
            },
          });
        });

        succeeded.push(job.id);
      } catch (error: any) {
        failed.push({ jobId: job.id, error: error.message });
      }
    }

    if (succeeded.length > 0) {
      await this.prisma.auditLog.create({
        data: {
          action: 'RENDER_JOBS_BATCH_RESUMED',
          userId,
          metadata: { succeededCount: succeeded.length, failedCount: failed.length },
        },
      });
    }

    return { succeeded, failed, skipped };
  }

  /**
   * Pauses all queued/assigned jobs for a specific project.
   */
  public async pauseAllForProject(projectId: string, userId: string, reason?: string): Promise<number> {
    const jobs = await this.prisma.renderJob.findMany({
      where: {
        projectId,
        userId,
        status: { in: ['QUEUED', 'ASSIGNED'] },
      },
      select: { id: true, status: true, metadata: true },
    });

    if (jobs.length === 0) return 0;

    let pausedCount = 0;

    for (const job of jobs) {
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: {
              status: 'CANCELLED',
              metadata: {
                ...(typeof job.metadata === 'object' && job.metadata !== null ? job.metadata as Record<string, unknown> : {}),
                pausedAt: new Date().toISOString(),
                pausedFromStatus: job.status,
                pauseReason: reason || 'Project-wide pause',
              },
            },
          });

          await tx.renderJobLog.create({
            data: {
              renderJobId: job.id,
              level: 'INFO',
              message: 'Job paused via project-wide pause',
              data: { previousStatus: job.status, projectId, pausedBy: userId },
            },
          });
        });

        pausedCount++;
      } catch {
        // Skip individual failures
      }
    }

    if (pausedCount > 0) {
      await this.prisma.auditLog.create({
        data: {
          action: 'RENDER_JOBS_PROJECT_PAUSED',
          userId,
          metadata: { projectId, pausedCount, reason: reason || null },
        },
      });
    }

    return pausedCount;
  }
}

export const queuePauseResumeService = new QueuePauseResumeService();
