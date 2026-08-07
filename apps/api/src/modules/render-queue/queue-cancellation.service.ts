import { PrismaClient } from '@prisma/client';
import { AppError } from '@/shared/errors/app-error';
import { prisma as prismaClient } from '@/lib/prisma';
import { queueValidator, QueueValidator } from './queue-validator';

interface BatchCancelResult {
  succeeded: string[];
  failed: Array<{ jobId: string; error: string }>;
  skipped: string[];
}

/**
 * Handles all cancellation operations for the render queue.
 * Supports single cancellation, batch cancellation, and project-wide cancellation.
 */
export class QueueCancellationService {
  constructor(
    private readonly prisma: PrismaClient = prismaClient,
    private readonly validator: QueueValidator = queueValidator
  ) {}

  /**
   * Cancels a single render job with full validation and audit logging.
   */
  public async cancelJob(jobId: string, userId: string, reason?: string) {
    const job = await this.prisma.renderJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw AppError.notFound('Render job');
    }

    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied to this render job');
    }

    this.validator.validateCancellation(job.status);

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'CANCELLED',
          completedAt: new Date(),
          actualDuration: job.startedAt ? (Date.now() - job.startedAt.getTime()) / 1000 : null,
          errorMessage: reason || null,
          errorCode: reason ? 'USER_CANCELLED' : null,
        },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'WARN',
          message: reason ? `Job cancelled: ${reason}` : 'Job cancelled by user',
          data: { previousStatus: job.status, cancelledBy: userId, reason: reason || null },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  /**
   * Cancels multiple jobs at once.
   */
  public async batchCancel(
    jobIds: string[],
    userId: string,
    reason?: string
  ): Promise<BatchCancelResult> {
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
        this.validator.validateCancellation(job.status);

        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: {
              status: 'CANCELLED',
              completedAt: new Date(),
              actualDuration: job.startedAt ? (Date.now() - job.startedAt.getTime()) / 1000 : null,
              errorMessage: reason || null,
              errorCode: reason ? 'BATCH_CANCELLED' : null,
            },
          });

          await tx.renderJobLog.create({
            data: {
              renderJobId: job.id,
              level: 'WARN',
              message: `Job cancelled via batch operation`,
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
          action: 'RENDER_JOBS_BATCH_CANCELLED',
          userId,
          metadata: {
            succeededCount: succeeded.length,
            failedCount: failed.length,
            skippedCount: skipped.length,
            reason: reason || null,
          },
        },
      });
    }

    return { succeeded, failed, skipped };
  }

  /**
   * Cancels all active render jobs for a specific project.
   */
  public async cancelAllForProject(
    projectId: string,
    userId: string,
    reason?: string
  ): Promise<number> {
    const cancellableStatuses = ['QUEUED', 'ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'];

    const jobs = await this.prisma.renderJob.findMany({
      where: {
        projectId,
        userId,
        status: { in: cancellableStatuses as any },
      },
      select: { id: true, status: true, startedAt: true },
    });

    if (jobs.length === 0) return 0;

    let cancelledCount = 0;
    const now = new Date();

    for (const job of jobs) {
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: {
              status: 'CANCELLED',
              completedAt: now,
              actualDuration: job.startedAt ? (now.getTime() - job.startedAt.getTime()) / 1000 : null,
              errorMessage: reason || 'Cancelled via project-wide cancellation',
              errorCode: 'PROJECT_CANCELLED',
            },
          });

          await tx.renderJobLog.create({
            data: {
              renderJobId: job.id,
              level: 'WARN',
              message: `Job cancelled via project-wide cancellation`,
              data: { previousStatus: job.status, projectId, cancelledBy: userId },
            },
          });
        });

        cancelledCount++;
      } catch {
        // Skip individual failures
      }
    }

    if (cancelledCount > 0) {
      await this.prisma.auditLog.create({
        data: {
          action: 'RENDER_JOBS_PROJECT_CANCELLED',
          userId,
          metadata: { projectId, cancelledCount, reason: reason || null },
        },
      });
    }

    return cancelledCount;
  }
}

export const queueCancellationService = new QueueCancellationService();
