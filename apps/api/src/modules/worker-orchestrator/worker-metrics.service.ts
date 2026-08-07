import { WorkerMetrics } from './worker.types';
import { workerRegistry, WorkerRegistry } from './worker-registry';

/**
 * Service that tracks and calculates in-memory performance metrics
 * for worker nodes, including job execution counts, running averages, uptime, and resource usage.
 */
export class WorkerMetricsService {
  private readonly registry: WorkerRegistry;
  private readonly metrics: Map<string, WorkerMetrics>;
  private readonly startTimes: Map<string, number>;
  private readonly jobStartTimes: Map<string, number>;

  /**
   * Creates an instance of WorkerMetricsService.
   *
   * @param registry - Instance of WorkerRegistry (defaults to workerRegistry singleton)
   */
  constructor(registry: WorkerRegistry = workerRegistry) {
    this.registry = registry;
    this.metrics = new Map<string, WorkerMetrics>();
    this.startTimes = new Map<string, number>();
    this.jobStartTimes = new Map<string, number>();
  }

  /**
   * Initializes performance metrics tracking for a specific worker.
   * Sets up zeroed initial counters and records worker start timestamp.
   *
   * @param workerId - Unique identifier of the worker
   */
  public initializeMetrics(workerId: string): void {
    const now = Date.now();
    this.startTimes.set(workerId, now);
    this.metrics.set(workerId, {
      workerId,
      totalJobsProcessed: 0,
      totalJobsFailed: 0,
      totalJobsCompleted: 0,
      averageProcessingTimeMs: 0,
      uptime: 0,
      lastJobAt: null,
      cpuUsage: 0,
      memoryUsageMb: 0,
    });
  }

  /**
   * Records the start time of a job for a given worker.
   *
   * @param workerId - Unique identifier of the worker executing the job
   */
  public recordJobStarted(workerId: string): void {
    if (!this.metrics.has(workerId)) {
      this.initializeMetrics(workerId);
    }
    this.jobStartTimes.set(workerId, Date.now());
  }

  /**
   * Records a successfully completed job execution for a worker.
   * Increments processed and completed counters, updates running average processing time,
   * and sets the last job timestamp.
   *
   * @param workerId - Unique identifier of the worker
   * @param durationMs - Optional execution duration in milliseconds (computed from job start time if omitted)
   */
  public recordJobCompleted(workerId: string, durationMs?: number): void {
    let metrics = this.metrics.get(workerId);
    if (!metrics) {
      this.initializeMetrics(workerId);
      metrics = this.metrics.get(workerId)!;
    }

    const jobStartTime = this.jobStartTimes.get(workerId);
    const actualDuration = durationMs ?? (jobStartTime ? Date.now() - jobStartTime : 0);
    this.jobStartTimes.delete(workerId);

    const prevCompleted = metrics.totalJobsCompleted;
    const newCompleted = prevCompleted + 1;
    const newProcessed = metrics.totalJobsProcessed + 1;
    const currentAvg = metrics.averageProcessingTimeMs;
    const newAvg = (currentAvg * prevCompleted + actualDuration) / newCompleted;

    metrics.totalJobsProcessed = newProcessed;
    metrics.totalJobsCompleted = newCompleted;
    metrics.averageProcessingTimeMs = newAvg;
    metrics.lastJobAt = new Date();
  }

  /**
   * Records a failed job execution for a worker.
   * Increments processed and failed counters, and sets the last job timestamp.
   *
   * @param workerId - Unique identifier of the worker
   */
  public recordJobFailed(workerId: string): void {
    let metrics = this.metrics.get(workerId);
    if (!metrics) {
      this.initializeMetrics(workerId);
      metrics = this.metrics.get(workerId)!;
    }

    this.jobStartTimes.delete(workerId);
    metrics.totalJobsProcessed += 1;
    metrics.totalJobsFailed += 1;
    metrics.lastJobAt = new Date();
  }

  /**
   * Retrieves performance metrics for a specific worker with dynamic uptime calculation.
   *
   * @param workerId - Unique identifier of the worker
   * @returns WorkerMetrics object if found, undefined otherwise
   */
  public getMetrics(workerId: string): WorkerMetrics | undefined {
    const metrics = this.metrics.get(workerId);
    if (!metrics) {
      return undefined;
    }
    return {
      ...metrics,
      uptime: this.getUptime(workerId),
    };
  }

  /**
   * Retrieves performance metrics for all tracked workers with updated uptime.
   *
   * @returns Array of WorkerMetrics objects
   */
  public getAllMetrics(): WorkerMetrics[] {
    return Array.from(this.metrics.keys()).map((workerId) => this.getMetrics(workerId)!);
  }

  /**
   * Calculates aggregate performance metrics across all tracked workers.
   *
   * @returns Aggregate summary containing global job totals, weighted average processing time, rates, and worker count
   */
  public getAggregateMetrics(): {
    totalProcessed: number;
    totalCompleted: number;
    totalFailed: number;
    averageProcessingTimeMs: number;
    successRate: number;
    failureRate: number;
    workerCount: number;
  } {
    const allMetrics = Array.from(this.metrics.values());
    let totalProcessed = 0;
    let totalCompleted = 0;
    let totalFailed = 0;
    let totalProcessingTimeMs = 0;

    for (const metric of allMetrics) {
      totalProcessed += metric.totalJobsProcessed;
      totalCompleted += metric.totalJobsCompleted;
      totalFailed += metric.totalJobsFailed;
      totalProcessingTimeMs += metric.averageProcessingTimeMs * metric.totalJobsCompleted;
    }

    const averageProcessingTimeMs = totalCompleted > 0 ? totalProcessingTimeMs / totalCompleted : 0;
    const successRate = totalProcessed > 0 ? (totalCompleted / totalProcessed) * 100 : 0;
    const failureRate = totalProcessed > 0 ? (totalFailed / totalProcessed) * 100 : 0;

    return {
      totalProcessed,
      totalCompleted,
      totalFailed,
      averageProcessingTimeMs,
      successRate,
      failureRate,
      workerCount: this.metrics.size,
    };
  }

  /**
   * Resets performance metrics for a specific worker back to zero state.
   *
   * @param workerId - Unique identifier of the worker
   */
  public resetMetrics(workerId: string): void {
    if (this.metrics.has(workerId)) {
      this.initializeMetrics(workerId);
    }
  }

  /**
   * Resets performance metrics for all currently tracked workers.
   */
  public resetAllMetrics(): void {
    for (const workerId of this.metrics.keys()) {
      this.initializeMetrics(workerId);
    }
  }

  /**
   * Calculates operational uptime in milliseconds for a worker.
   *
   * @param workerId - Unique identifier of the worker
   * @returns Uptime duration in milliseconds, or 0 if not tracked
   */
  public getUptime(workerId: string): number {
    const startTime = this.startTimes.get(workerId);
    if (!startTime) {
      return 0;
    }
    return Date.now() - startTime;
  }

  /**
   * Updates CPU and memory usage statistics for a worker.
   *
   * @param workerId - Unique identifier of the worker
   * @param cpuUsage - CPU usage metric
   * @param memoryUsageMb - Memory consumption in megabytes
   */
  public updateResourceUsage(workerId: string, cpuUsage: number, memoryUsageMb: number): void {
    let metrics = this.metrics.get(workerId);
    if (!metrics) {
      this.initializeMetrics(workerId);
      metrics = this.metrics.get(workerId)!;
    }

    metrics.cpuUsage = cpuUsage;
    metrics.memoryUsageMb = memoryUsageMb;
  }
}

export const workerMetricsService = new WorkerMetricsService();
