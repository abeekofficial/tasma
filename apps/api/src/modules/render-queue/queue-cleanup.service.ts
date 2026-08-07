import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

interface CleanupResult {
  removedCount: number;
  removedJobIds: string[];
  errors: string[];
}

interface CleanupOptions {
  olderThanDays?: number;
  statuses?: string[];
  dryRun?: boolean;
  limit?: number;
}

/**
 * Handles automated and manual cleanup of render queue jobs.
 * Removes stale, expired, or completed jobs based on configurable policies.
 */
export class QueueCleanupService {
  private readonly DEFAULT_RETENTION_DAYS = 30;
  private readonly DEFAULT_CLEANUP_LIMIT = 500;

  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  /**
   * Cleans up old completed jobs that are older than the retention period.
   */
  public async cleanupCompletedJobs(
    userId: string,
    options: CleanupOptions = {}
  ): Promise<CleanupResult> {
    const retentionDays = options.olderThanDays ?? this.DEFAULT_RETENTION_DAYS;
    const limit = options.limit ?? this.DEFAULT_CLEANUP_LIMIT;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const targetStatuses = options.statuses ?? ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'];

    const jobsToClean = await this.prisma.renderJob.findMany({
      where: {
        userId,
        status: { in: targetStatuses as any },
        updatedAt: { lt: cutoffDate },
      },
      select: { id: true, status: true, projectId: true },
      take: limit,
      orderBy: { updatedAt: 'asc' },
    });

    if (options.dryRun) {
      return {
        removedCount: jobsToClean.length,
        removedJobIds: jobsToClean.map((j) => j.id),
        errors: [],
      };
    }

    const removedJobIds: string[] = [];
    const errors: string[] = [];

    for (const job of jobsToClean) {
      try {
        await this.prisma.$transaction(async (tx) => {
          // Delete logs first (cascade should handle this, but being explicit)
          await tx.renderJobLog.deleteMany({ where: { renderJobId: job.id } });
          await tx.renderJob.delete({ where: { id: job.id } });
        });
        removedJobIds.push(job.id);
      } catch (error: any) {
        errors.push(`Failed to clean job ${job.id}: ${error.message}`);
      }
    }

    if (removedJobIds.length > 0) {
      await this.prisma.auditLog.create({
        data: {
          action: 'RENDER_QUEUE_CLEANUP',
          userId,
          metadata: {
            removedCount: removedJobIds.length,
            retentionDays,
            targetStatuses,
          },
        },
      });
    }

    return {
      removedCount: removedJobIds.length,
      removedJobIds,
      errors,
    };
  }

  /**
   * Cleans up orphaned logs whose parent render job no longer exists.
   */
  public async cleanupOrphanedLogs(userId: string): Promise<number> {
    // Find logs where the render job has been deleted
    const orphanedLogs = await this.prisma.$queryRawUnsafe<Array<{ id: string }>>(
      `SELECT rl.id FROM render_job_logs rl
       LEFT JOIN render_jobs rj ON rl."renderJobId" = rj.id
       WHERE rj.id IS NULL
       LIMIT 1000`
    );

    if (orphanedLogs.length === 0) return 0;

    const orphanedIds = orphanedLogs.map((l) => l.id);
    const result = await this.prisma.renderJobLog.deleteMany({
      where: { id: { in: orphanedIds } },
    });

    return result.count;
  }

  /**
   * Identifies and marks stale jobs that have been stuck in an active state
   * for longer than the specified timeout.
   */
  public async detectStaleJobs(
    userId: string,
    timeoutMinutes: number = 60
  ): Promise<Array<{ id: string; status: string; lastUpdated: Date }>> {
    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() - timeoutMinutes);

    const staleJobs = await this.prisma.renderJob.findMany({
      where: {
        userId,
        status: { in: ['ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'] },
        updatedAt: { lt: cutoff },
      },
      select: { id: true, status: true, updatedAt: true },
      orderBy: { updatedAt: 'asc' },
    });

    return staleJobs.map((job) => ({
      id: job.id,
      status: job.status,
      lastUpdated: job.updatedAt,
    }));
  }

  /**
   * Force-fails stale jobs that have exceeded the timeout.
   * Returns the count of jobs that were marked as TIMED_OUT.
   */
  public async timeoutStaleJobs(
    userId: string,
    timeoutMinutes: number = 60
  ): Promise<number> {
    const cutoff = new Date();
    cutoff.setMinutes(cutoff.getMinutes() - timeoutMinutes);

    const result = await this.prisma.renderJob.updateMany({
      where: {
        userId,
        status: { in: ['ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'] },
        updatedAt: { lt: cutoff },
      },
      data: {
        status: 'TIMED_OUT',
        errorMessage: `Job timed out after ${timeoutMinutes} minutes of inactivity`,
        errorCode: 'STALE_JOB_TIMEOUT',
        completedAt: new Date(),
      },
    });

    if (result.count > 0) {
      await this.prisma.auditLog.create({
        data: {
          action: 'RENDER_JOBS_TIMED_OUT',
          userId,
          metadata: { timedOutCount: result.count, timeoutMinutes },
        },
      });
    }

    return result.count;
  }

  /**
   * Returns a summary of cleanable jobs (preview before actual cleanup).
   */
  public async getCleanupPreview(
    userId: string,
    olderThanDays: number = 30
  ): Promise<{ total: number; byStatus: Record<string, number> }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const groups = await this.prisma.renderJob.groupBy({
      by: ['status'],
      where: {
        userId,
        status: { in: ['COMPLETED', 'FAILED', 'CANCELLED', 'TIMED_OUT'] },
        updatedAt: { lt: cutoffDate },
      },
      _count: { id: true },
    });

    const byStatus = groups.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});

    const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
    return { total, byStatus };
  }
}

export const queueCleanupService = new QueueCleanupService();
