import { PrismaClient, Prisma } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

interface QueueStatsResult {
  totalJobs: number;
  statusBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
  averageDuration: number | null;
  averageWaitTime: number | null;
  successRate: number;
  failureRate: number;
  activeJobCount: number;
  queuedJobCount: number;
}

interface QueueTrendPoint {
  date: string;
  completed: number;
  failed: number;
  cancelled: number;
  created: number;
}

/**
 * Provides advanced queue statistics, analytics, and trend data.
 * All queries are scoped to a specific user for data isolation.
 */
export class QueueStatisticsService {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  /**
   * Returns a comprehensive statistics snapshot for a user's render queue.
   */
  public async getQueueOverview(userId: string): Promise<QueueStatsResult> {
    const [
      statusGroups,
      priorityGroups,
      typeGroups,
      durationStats,
      total,
    ] = await Promise.all([
      this.prisma.renderJob.groupBy({
        by: ['status'],
        where: { userId },
        _count: { id: true },
      }),
      this.prisma.renderJob.groupBy({
        by: ['priority'],
        where: { userId },
        _count: { id: true },
      }),
      this.prisma.renderJob.groupBy({
        by: ['type'],
        where: { userId },
        _count: { id: true },
      }),
      this.prisma.renderJob.aggregate({
        where: { userId, status: 'COMPLETED', actualDuration: { not: null } },
        _avg: { actualDuration: true },
      }),
      this.prisma.renderJob.count({ where: { userId } }),
    ]);

    const statusBreakdown = statusGroups.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});

    const priorityBreakdown = priorityGroups.reduce<Record<string, number>>((acc, row) => {
      acc[row.priority] = row._count.id;
      return acc;
    }, {});

    const typeBreakdown = typeGroups.reduce<Record<string, number>>((acc, row) => {
      acc[row.type] = row._count.id;
      return acc;
    }, {});

    const completedCount = statusBreakdown['COMPLETED'] || 0;
    const failedCount = statusBreakdown['FAILED'] || 0;
    const finishedCount = completedCount + failedCount;
    const activeStatuses = ['ASSIGNED', 'PROCESSING', 'ENCODING', 'UPLOADING'];
    const activeJobCount = activeStatuses.reduce((sum, s) => sum + (statusBreakdown[s] || 0), 0);
    const queuedJobCount = statusBreakdown['QUEUED'] || 0;

    // Calculate average wait time (time from creation to startedAt)
    const waitTimeResult = await this.prisma.$queryRawUnsafe<Array<{ avg_wait: number | null }>>(
      `SELECT AVG(EXTRACT(EPOCH FROM ("startedAt" - "createdAt"))) as avg_wait
       FROM render_jobs
       WHERE "userId" = $1 AND "startedAt" IS NOT NULL`,
      userId
    );
    const averageWaitTime = waitTimeResult[0]?.avg_wait ?? null;

    return {
      totalJobs: total,
      statusBreakdown,
      priorityBreakdown,
      typeBreakdown,
      averageDuration: durationStats._avg.actualDuration ?? null,
      averageWaitTime,
      successRate: finishedCount > 0 ? (completedCount / finishedCount) * 100 : 0,
      failureRate: finishedCount > 0 ? (failedCount / finishedCount) * 100 : 0,
      activeJobCount,
      queuedJobCount,
    };
  }

  /**
   * Returns daily trend data for a user's render jobs over the specified number of days.
   */
  public async getQueueTrends(userId: string, days: number = 30): Promise<QueueTrendPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const jobs = await this.prisma.renderJob.findMany({
      where: {
        userId,
        createdAt: { gte: since },
      },
      select: {
        status: true,
        createdAt: true,
        completedAt: true,
      },
    });

    const trendMap = new Map<string, QueueTrendPoint>();

    // Initialize all days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      trendMap.set(key, { date: key, completed: 0, failed: 0, cancelled: 0, created: 0 });
    }

    for (const job of jobs) {
      const createdKey = job.createdAt.toISOString().split('T')[0];
      const entry = trendMap.get(createdKey);
      if (entry) {
        entry.created++;
      }

      if (job.completedAt) {
        const completedKey = job.completedAt.toISOString().split('T')[0];
        const completedEntry = trendMap.get(completedKey);
        if (completedEntry) {
          if (job.status === 'COMPLETED') completedEntry.completed++;
          else if (job.status === 'FAILED') completedEntry.failed++;
          else if (job.status === 'CANCELLED') completedEntry.cancelled++;
        }
      }
    }

    return Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Returns statistics scoped to a specific project.
   */
  public async getProjectStats(
    userId: string,
    projectId: string
  ): Promise<{ total: number; statusBreakdown: Record<string, number>; averageDuration: number | null }> {
    const [statusGroups, durationStats, total] = await Promise.all([
      this.prisma.renderJob.groupBy({
        by: ['status'],
        where: { userId, projectId },
        _count: { id: true },
      }),
      this.prisma.renderJob.aggregate({
        where: { userId, projectId, status: 'COMPLETED', actualDuration: { not: null } },
        _avg: { actualDuration: true },
      }),
      this.prisma.renderJob.count({ where: { userId, projectId } }),
    ]);

    const statusBreakdown = statusGroups.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});

    return {
      total,
      statusBreakdown,
      averageDuration: durationStats._avg.actualDuration ?? null,
    };
  }

  /**
   * Returns the estimated wait time for a new job based on current queue state.
   */
  public async estimateWaitTime(userId: string, priority: string): Promise<number | null> {
    const priorityWeight: Record<string, number> = { LOW: 0, NORMAL: 1, HIGH: 2, URGENT: 3 };
    const weight = priorityWeight[priority] ?? 1;

    // Count jobs ahead in queue with equal or higher priority
    const jobsAhead = await this.prisma.renderJob.count({
      where: {
        userId,
        status: { in: ['QUEUED', 'ASSIGNED'] },
        priority: { in: Object.entries(priorityWeight).filter(([, w]) => w >= weight).map(([k]) => k) as any },
      },
    });

    if (jobsAhead === 0) return 0;

    // Average duration of completed jobs
    const avgDuration = await this.prisma.renderJob.aggregate({
      where: { userId, status: 'COMPLETED', actualDuration: { not: null } },
      _avg: { actualDuration: true },
    });

    const avgSeconds = avgDuration._avg.actualDuration ?? 120; // Default 2 min estimate
    return Math.ceil(jobsAhead * avgSeconds);
  }
}

export const queueStatisticsService = new QueueStatisticsService();
