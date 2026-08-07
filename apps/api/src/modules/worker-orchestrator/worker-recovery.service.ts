import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { workerLifecycleService, WorkerLifecycleService } from './worker-lifecycle.service';
import { workerPool, WorkerPool } from './worker-pool';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { workerScheduler, WorkerScheduler } from './worker-scheduler';
import { WorkerInfo } from './worker.types';

/**
 * WorkerRecoveryService handles recovery of failed and offline workers,
 * cleans up expired job leases, stale worker heartbeats, and requeues orphaned jobs.
 */
export class WorkerRecoveryService {
  private readonly registry: WorkerRegistry;
  private readonly pool: WorkerPool;
  private readonly scheduler: WorkerScheduler;
  private readonly lifecycleService: WorkerLifecycleService;
  private readonly eventBus: WorkerEventBus;

  /**
   * Initializes a new WorkerRecoveryService instance.
   *
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param pool - WorkerPool instance (defaults to singleton workerPool)
   * @param scheduler - WorkerScheduler instance (defaults to singleton workerScheduler)
   * @param lifecycleService - WorkerLifecycleService instance (defaults to singleton workerLifecycleService)
   * @param eventBus - WorkerEventBus instance (defaults to singleton workerEventBus)
   */
  constructor(
    registry: WorkerRegistry = workerRegistry,
    pool: WorkerPool = workerPool,
    scheduler: WorkerScheduler = workerScheduler,
    lifecycleService: WorkerLifecycleService = workerLifecycleService,
    eventBus: WorkerEventBus = workerEventBus
  ) {
    this.registry = registry;
    this.pool = pool;
    this.scheduler = scheduler;
    this.lifecycleService = lifecycleService;
    this.eventBus = eventBus;
  }

  /**
   * Recovers a specific worker by ID.
   * If state is FAILED, restarts worker by setting state to IDLE and emitting WORKER_RECOVERED event.
   * If state is OFFLINE, starts the worker using lifecycle service.
   * Otherwise, throws a bad request AppError.
   *
   * @param workerId - Unique ID of the worker to recover
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   * @throws AppError 400 if worker is not in FAILED or OFFLINE state
   */
  public recoverWorker(workerId: string): WorkerInfo {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    if (worker.state === 'FAILED') {
      const updatedWorker = this.registry.updateState(workerId, 'IDLE');

      this.eventBus.emit({
        type: 'WORKER_RECOVERED',
        workerId,
        timestamp: new Date(),
        data: { previousState: 'FAILED' },
      });

      return updatedWorker;
    }

    if (worker.state === 'OFFLINE') {
      return this.lifecycleService.startWorker(workerId);
    }

    throw AppError.badRequest(
      `Worker '${workerId}' is in state '${worker.state}' and cannot be recovered`
    );
  }

  /**
   * Finds all workers currently in FAILED state, recovers each worker, and returns the total count recovered.
   *
   * @returns Number of recovered workers
   */
  public recoverAllFailed(): number {
    const failedWorkers = this.registry.getWorkersByState('FAILED');

    for (const worker of failedWorkers) {
      this.recoverWorker(worker.id);
    }

    return failedWorkers.length;
  }

  /**
   * Identifies all active workers whose heartbeat timestamp exceeds the timeout threshold,
   * marks each as FAILED, then recovers each worker.
   *
   * @param timeoutMs - Heartbeat timeout duration in milliseconds
   * @returns Number of stale workers recovered
   */
  public recoverStaleWorkers(timeoutMs: number): number {
    const workers = this.registry.getAllWorkers();
    const now = Date.now();
    let recoveredCount = 0;

    for (const worker of workers) {
      if (worker.state === 'OFFLINE') {
        continue;
      }

      const elapsed = now - worker.lastHeartbeat.getTime();
      if (elapsed > timeoutMs) {
        this.lifecycleService.markFailed(worker.id, 'Heartbeat timeout');
        this.recoverWorker(worker.id);
        recoveredCount++;
      }
    }

    return recoveredCount;
  }

  /**
   * Retrieves all expired leases from the pool, releases assigned jobs via the scheduler,
   * revokes each lease, and returns the count of handled leases.
   *
   * @returns Number of expired leases handled
   */
  public handleExpiredLeases(): number {
    const expiredLeases = this.pool.getExpiredLeases();
    let handledCount = 0;

    for (const lease of expiredLeases) {
      const assignment = this.scheduler.getAssignment(lease.jobId);
      if (assignment) {
        this.scheduler.releaseJob(lease.jobId);
      } else {
        this.pool.revokeLease(lease.workerId);
      }
      handledCount++;
    }

    return handledCount;
  }

  /**
   * Finds all active job assignments where the assigned worker is either OFFLINE or FAILED,
   * requeues each job via the scheduler, and returns the total count of requeued jobs.
   *
   * @returns Number of orphaned jobs requeued
   */
  public requeueOrphanedJobs(): number {
    const assignments = this.scheduler.getActiveAssignments();
    let requeuedCount = 0;

    for (const assignment of assignments) {
      const worker = this.registry.getWorker(assignment.workerId);
      if (!worker || worker.state === 'OFFLINE' || worker.state === 'FAILED') {
        this.scheduler.requeueJob(assignment.jobId);
        requeuedCount++;
      }
    }

    return requeuedCount;
  }
}

export const workerRecoveryService = new WorkerRecoveryService();
