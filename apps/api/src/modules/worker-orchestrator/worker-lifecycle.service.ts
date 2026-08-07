import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { workerPool, WorkerPool } from './worker-pool';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { workerScheduler, WorkerScheduler } from './worker-scheduler';
import { WorkerInfo, WorkerState } from './worker.types';

/**
 * Service managing worker lifecycle operations: start, stop, pause, resume,
 * restart, graceful shutdown, shutdown callbacks, and failure state handling.
 */
export class WorkerLifecycleService {
  private readonly registry: WorkerRegistry;
  private readonly pool: WorkerPool;
  private readonly scheduler: WorkerScheduler;
  private readonly eventBus: WorkerEventBus;
  private readonly shutdownCallbacks: Map<string, () => Promise<void>>;

  /**
   * Initializes a new WorkerLifecycleService instance.
   *
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param pool - WorkerPool instance (defaults to singleton workerPool)
   * @param scheduler - WorkerScheduler instance (defaults to singleton workerScheduler)
   * @param eventBus - WorkerEventBus instance (defaults to singleton workerEventBus)
   */
  constructor(
    registry: WorkerRegistry = workerRegistry,
    pool: WorkerPool = workerPool,
    scheduler: WorkerScheduler = workerScheduler,
    eventBus: WorkerEventBus = workerEventBus
  ) {
    this.registry = registry;
    this.pool = pool;
    this.scheduler = scheduler;
    this.eventBus = eventBus;
    this.shutdownCallbacks = new Map<string, () => Promise<void>>();
  }

  /**
   * Starts a worker by verifying its existence, updating its state to IDLE,
   * and emitting the WORKER_STATE_CHANGED event.
   *
   * @param workerId - Unique ID of the worker to start
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   */
  public startWorker(workerId: string): WorkerInfo {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    return this.registry.updateState(workerId, 'IDLE');
  }

  /**
   * Stops a worker if it does not have an active job assignment.
   * Updates state to STOPPING, emits WORKER_STOPPING event, executes registered
   * shutdown callback if present, and updates state to OFFLINE.
   *
   * @param workerId - Unique ID of the worker to stop
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   * @throws AppError 409 if worker has an active job assignment
   */
  public async stopWorker(workerId: string): Promise<WorkerInfo> {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    const assignment = this.scheduler.getWorkerAssignment(workerId);
    if (assignment) {
      throw AppError.conflict(`Worker '${workerId}' has an active job '${assignment.jobId}'`);
    }

    this.registry.updateState(workerId, 'STOPPING');

    this.eventBus.emit({
      type: 'WORKER_STOPPING',
      workerId,
      timestamp: new Date(),
    });

    const callback = this.shutdownCallbacks.get(workerId);
    if (callback) {
      await callback();
    }

    return this.registry.updateState(workerId, 'OFFLINE');
  }

  /**
   * Pauses an idle worker. Only workers in IDLE state can be paused.
   *
   * @param workerId - Unique ID of the worker to pause
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   * @throws AppError 400 if worker is not in IDLE state
   */
  public pauseWorker(workerId: string): WorkerInfo {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    if (worker.state !== 'IDLE') {
      throw AppError.badRequest(
        `Worker '${workerId}' is in state '${worker.state}' and cannot be paused. Only IDLE workers can be paused.`
      );
    }

    return this.registry.updateState(workerId, 'PAUSED');
  }

  /**
   * Resumes a paused worker. Only workers in PAUSED state can be resumed.
   *
   * @param workerId - Unique ID of the worker to resume
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   * @throws AppError 400 if worker is not in PAUSED state
   */
  public resumeWorker(workerId: string): WorkerInfo {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    if (worker.state !== 'PAUSED') {
      throw AppError.badRequest(
        `Worker '${workerId}' is in state '${worker.state}' and cannot be resumed. Only PAUSED workers can be resumed.`
      );
    }

    return this.registry.updateState(workerId, 'IDLE');
  }

  /**
   * Restarts a worker by transitioning state through RESTARTING (emitting WORKER_RESTARTING),
   * stopping the worker, and starting it again.
   *
   * @param workerId - Unique ID of the worker to restart
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   * @throws AppError 409 if worker has an active job assignment
   */
  public async restartWorker(workerId: string): Promise<WorkerInfo> {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    const assignment = this.scheduler.getWorkerAssignment(workerId);
    if (assignment) {
      throw AppError.conflict(`Worker '${workerId}' has an active job '${assignment.jobId}'`);
    }

    this.registry.updateState(workerId, 'RESTARTING');

    this.eventBus.emit({
      type: 'WORKER_RESTARTING',
      workerId,
      timestamp: new Date(),
    });

    await this.stopWorker(workerId);
    return this.startWorker(workerId);
  }

  /**
   * Gracefully shuts down a worker.
   * Sets state to STOPPING, logs if an active job is in progress,
   * executes registered shutdown callback, and sets state to OFFLINE.
   *
   * @param workerId - Unique ID of the worker to shut down
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   */
  public async gracefulShutdown(workerId: string): Promise<WorkerInfo> {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    this.registry.updateState(workerId, 'STOPPING');

    this.eventBus.emit({
      type: 'WORKER_STOPPING',
      workerId,
      timestamp: new Date(),
    });

    const assignment = this.scheduler.getWorkerAssignment(workerId);
    if (assignment) {
      console.log(
        `[WorkerLifecycleService] Worker '${workerId}' has active job '${assignment.jobId}'. Waiting for job completion before shutdown...`
      );
    }

    const callback = this.shutdownCallbacks.get(workerId);
    if (callback) {
      await callback();
    }

    return this.registry.updateState(workerId, 'OFFLINE');
  }

  /**
   * Gracefully shuts down all non-offline workers in the registry.
   *
   * @returns Promise resolving to the total count of workers shut down
   */
  public async gracefulShutdownAll(): Promise<number> {
    const activeWorkers = this.registry
      .getAllWorkers()
      .filter((worker) => worker.state !== 'OFFLINE');

    for (const worker of activeWorkers) {
      await this.gracefulShutdown(worker.id);
    }

    return activeWorkers.length;
  }

  /**
   * Registers a shutdown callback function for a specific worker.
   *
   * @param workerId - Unique ID of the worker
   * @param callback - Async function to execute during worker shutdown
   * @throws AppError 404 if worker is not found
   */
  public registerShutdownCallback(workerId: string, callback: () => Promise<void>): void {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    this.shutdownCallbacks.set(workerId, callback);
  }

  /**
   * Unregisters a shutdown callback function for a worker.
   *
   * @param workerId - Unique ID of the worker
   */
  public unregisterShutdownCallback(workerId: string): void {
    this.shutdownCallbacks.delete(workerId);
  }

  /**
   * Marks a worker as failed, setting its state to FAILED and emitting
   * the WORKER_FAILED event with optional reason.
   *
   * @param workerId - Unique ID of the worker
   * @param reason - Optional failure reason description
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if worker is not found
   */
  public markFailed(workerId: string, reason?: string): WorkerInfo {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    const updatedWorker = this.registry.updateState(workerId, 'FAILED');

    this.eventBus.emit({
      type: 'WORKER_FAILED',
      workerId,
      timestamp: new Date(),
      data: { reason: reason ?? 'Unknown failure' },
    });

    return updatedWorker;
  }
}

export const workerLifecycleService = new WorkerLifecycleService();
