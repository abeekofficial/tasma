import { PrismaClient } from '@prisma/client';
import { AppError } from '@/shared/errors/app-error';
import { prisma as prismaClient } from '@/lib/prisma';
import { queueValidator, QueueValidator } from './queue-validator';

interface RetryOptions {
  resetProgress: boolean;
  priority?: string;
  reason?: string;
}

interface BatchRetryResult {
  succeeded: string[];
  failed: Array<{ jobId: string; error: string }>;
  skipped: string[];
}

/**
 * Dedicated service for render job retry operations.
 * Handles single-job retry, batch retry, and auto-retry with exponential backoff.
 */
export class QueueRetryService {
  constructor(
    private readonly prisma: PrismaClient = prismaClient,
    private readonly validator: QueueValidator = queueValidator
  ) {}

  /**
   * Retries a single render job with full validation and logging.
   */
  public async retryJob(jobId: string, userId: string, options: RetryOptions) {
    const job = await this.prisma.renderJob.findUnique({ where: { id: jobId } });

    if (!job) {
      throw AppError.notFound('Render job');
    }

    if (job.userId !== userId) {
      throw AppError.forbidden('Access denied to this render job');
    }

    this.validator.validateRetryEligibility(job.status, job.retryCount, job.maxRetries);

    const backoffDelay = this.calculateBackoff(job.retryCount);

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedJob = await tx.renderJob.update({
        where: { id: jobId },
        data: {
          status: 'QUEUED',
          progress: options.resetProgress ? 0 : job.progress,
          retryCount: { increment: 1 },
          priority: (options.priority as any) || job.priority,
          errorMessage: null,
          errorCode: null,
          startedAt: null,
          completedAt: null,
          actualDuration: null,
          workerId: null,
          metadata: {
            ...(typeof job.metadata === 'object' && job.metadata !== null ? job.metadata as Record<string, unknown> : {}),
            lastRetryAt: new Date().toISOString(),
            retryBackoffMs: backoffDelay,
            retryReason: options.reason || 'manual',
          },
        },
      });

      await tx.renderJobLog.create({
        data: {
          renderJobId: jobId,
          level: 'INFO',
          message: `Job retried (attempt ${updatedJob.retryCount} of ${updatedJob.maxRetries}). Backoff: ${backoffDelay}ms`,
          data: {
            previousStatus: job.status,
            retryCount: updatedJob.retryCount,
            backoffMs: backoffDelay,
            reason: options.reason || 'manual',
          },
        },
      });

      return updatedJob;
    });

    return updated;
  }

  /**
   * Batch retries multiple jobs at once. Validates each individually.
   */
  public async batchRetry(
    jobIds: string[],
    userId: string,
    options: RetryOptions
  ): Promise<BatchRetryResult> {
    const succeeded: string[] = [];
    const failed: Array<{ jobId: string; error: string }> = [];
    const skipped: string[] = [];

    const jobs = await this.prisma.renderJob.findMany({
      where: { id: { in: jobIds }, userId },
    });

    const foundIds = new Set(jobs.map((j) => j.id));

    // Track jobs not found or not owned by user
    for (const id of jobIds) {
      if (!foundIds.has(id)) {
        skipped.push(id);
      }
    }

    for (const job of jobs) {
      try {
        this.validator.validateRetryEligibility(job.status, job.retryCount, job.maxRetries);

        const backoffDelay = this.calculateBackoff(job.retryCount);

        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: {
              status: 'QUEUED',
              progress: options.resetProgress ? 0 : job.progress,
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
              renderJobId: job.id,
              level: 'INFO',
              message: `Job retried via batch operation. Backoff: ${backoffDelay}ms`,
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
          action: 'RENDER_JOBS_BATCH_RETRIED',
          userId,
          metadata: {
            succeededCount: succeeded.length,
            failedCount: failed.length,
            skippedCount: skipped.length,
          },
        },
      });
    }

    return { succeeded, failed, skipped };
  }

  /**
   * Auto-retries all failed jobs for a user that are still below their retry limit.
   * Returns the number of jobs queued for retry.
   */
  public async autoRetryFailedJobs(userId: string): Promise<number> {
    const failedJobs = await this.prisma.renderJob.findMany({
      where: {
        userId,
        status: 'FAILED',
      },
      select: { id: true, retryCount: true, maxRetries: true },
    });

    const eligibleJobs = failedJobs.filter((j) => j.retryCount < j.maxRetries);

    if (eligibleJobs.length === 0) return 0;

    let retriedCount = 0;

    for (const job of eligibleJobs) {
      try {
        const backoff = this.calculateBackoff(job.retryCount);

        await this.prisma.$transaction(async (tx) => {
          await tx.renderJob.update({
            where: { id: job.id },
            data: {
              status: 'QUEUED',
              progress: 0,
              retryCount: { increment: 1 },
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
              renderJobId: job.id,
              level: 'INFO',
              message: `Job auto-retried. Backoff: ${backoff}ms`,
              data: { autoRetry: true, backoffMs: backoff },
            },
          });
        });

        retriedCount++;
      } catch {
        // Skip individual failures in auto-retry
      }
    }

    return retriedCount;
  }

  /**
   * Calculates exponential backoff delay in milliseconds.
   * Base: 1000ms, multiplier: 2^retryCount, max: 5 minutes.
   */
  private calculateBackoff(retryCount: number): number {
    const baseDelay = 1000;
    const maxDelay = 300000; // 5 minutes
    const delay = baseDelay * Math.pow(2, retryCount);
    return Math.min(delay, maxDelay);
  }
}

export const queueRetryService = new QueueRetryService();
