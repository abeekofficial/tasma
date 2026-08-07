import { AppError } from '@/shared/errors/app-error';
import { workerHeartbeatService, WorkerHeartbeatService } from './worker-heartbeat.service';
import { workerPool, WorkerPool } from './worker-pool';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { workerScheduler, WorkerScheduler } from './worker-scheduler';
import { PoolStatus, WorkerHealthReport } from './worker.types';

/**
 * WorkerHealthService evaluates health metrics and operational status
 * for individual workers as well as the entire worker pool system.
 */
export class WorkerHealthService {
  private readonly registry: WorkerRegistry;
  private readonly pool: WorkerPool;
  private readonly heartbeatService: WorkerHeartbeatService;
  private readonly scheduler: WorkerScheduler;

  /**
   * Initializes a new WorkerHealthService instance.
   *
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param pool - WorkerPool instance (defaults to singleton workerPool)
   * @param heartbeatService - WorkerHeartbeatService instance (defaults to singleton workerHeartbeatService)
   * @param scheduler - WorkerScheduler instance (defaults to singleton workerScheduler)
   */
  constructor(
    registry: WorkerRegistry = workerRegistry,
    pool: WorkerPool = workerPool,
    heartbeatService: WorkerHeartbeatService = workerHeartbeatService,
    scheduler: WorkerScheduler = workerScheduler
  ) {
    this.registry = registry;
    this.pool = pool;
    this.heartbeatService = heartbeatService;
    this.scheduler = scheduler;
  }

  /**
   * Evaluates the health status of a single worker by checking heartbeat expiration,
   * load vs max concurrency, and FAILED state.
   *
   * @param workerId - Unique ID of the worker to check
   * @returns WorkerHealthReport detailing worker health metrics and issues
   * @throws AppError 404 if worker is not found
   */
  public checkWorkerHealth(workerId: string): WorkerHealthReport {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    const issues: string[] = [];

    const isExpired = this.heartbeatService.isHeartbeatExpired(workerId);
    if (isExpired) {
      issues.push('Heartbeat expired');
    }

    if (worker.currentLoad > worker.maxConcurrency) {
      issues.push(
        `Worker is overloaded: current load (${worker.currentLoad}) exceeds max concurrency (${worker.maxConcurrency})`
      );
    }

    if (worker.state === 'FAILED') {
      issues.push('Worker is in FAILED state');
    }

    const heartbeatAge = Date.now() - worker.lastHeartbeat.getTime();

    return {
      workerId: worker.id,
      state: worker.state,
      healthy: issues.length === 0,
      lastHeartbeat: worker.lastHeartbeat,
      heartbeatAge,
      currentLoad: worker.currentLoad,
      maxConcurrency: worker.maxConcurrency,
      issues,
    };
  }

  /**
   * Evaluates and returns health reports for all currently registered workers.
   *
   * @returns Array of WorkerHealthReport objects
   */
  public checkAllWorkerHealth(): WorkerHealthReport[] {
    const workers = this.registry.getAllWorkers();
    return workers.map((worker) => this.checkWorkerHealth(worker.id));
  }

  /**
   * Aggregates pool status and health metrics across all workers to determine overall pool health.
   *
   * @returns Object containing overall healthy flag, poolStatus metrics, list of unhealthy worker reports, and aggregated issue descriptions
   */
  public getPoolHealth(): {
    healthy: boolean;
    poolStatus: PoolStatus;
    unhealthyWorkers: WorkerHealthReport[];
    issues: string[];
  } {
    const poolStatus = this.pool.getPoolStatus();
    const allReports = this.checkAllWorkerHealth();
    const unhealthyWorkers = allReports.filter((report) => !report.healthy);

    const issues: string[] = [];

    if (poolStatus.failedWorkers > 0) {
      issues.push(`Pool contains ${poolStatus.failedWorkers} failed worker(s)`);
    }

    for (const report of unhealthyWorkers) {
      for (const issue of report.issues) {
        issues.push(`Worker ${report.workerId}: ${issue}`);
      }
    }

    const healthy = unhealthyWorkers.length === 0 && poolStatus.failedWorkers === 0;

    return {
      healthy,
      poolStatus,
      unhealthyWorkers,
      issues,
    };
  }

  /**
   * Checks whether the overall worker pool system is healthy.
   * Returns true if pool health is clean with no issues or unhealthy workers.
   *
   * @returns True if system is healthy, false otherwise
   */
  public isSystemHealthy(): boolean {
    const poolHealth = this.getPoolHealth();
    return poolHealth.healthy;
  }
}

export const workerHealthService = new WorkerHealthService();
