import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { PoolStatus, WorkerInfo, WorkerLease } from './worker.types';

/**
 * WorkerPool manages worker capacity, allocation, locking, and leasing
 * across the registered worker infrastructure.
 */
export class WorkerPool {
  private readonly registry: WorkerRegistry;
  private readonly eventBus: WorkerEventBus;
  private readonly locks: Map<string, string>; // workerId -> jobId
  private readonly leases: Map<string, WorkerLease>;
  private readonly DEFAULT_LEASE_DURATION_MS = 300000; // 5 minutes

  /**
   * Initializes a new WorkerPool instance.
   *
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param eventBus - WorkerEventBus instance (defaults to singleton workerEventBus)
   */
  constructor(
    registry: WorkerRegistry = workerRegistry,
    eventBus: WorkerEventBus = workerEventBus
  ) {
    this.registry = registry;
    this.eventBus = eventBus;
    this.locks = new Map<string, string>();
    this.leases = new Map<string, WorkerLease>();
  }

  /**
   * Acquires an available idle worker that supports the given capability.
   * Idle workers matching the capability are sorted by currentLoad in ascending order,
   * returning the worker with the lowest current load.
   *
   * @param capability - Required capability string
   * @param priority - Optional priority string
   * @returns WorkerInfo object of the acquired worker, or null if none available
   */
  public acquireWorker(capability: string, priority?: string): WorkerInfo | null {
    const idleWorkers = this.registry.getWorkersByState('IDLE');
    const matchingWorkers = idleWorkers.filter((worker) =>
      worker.capabilities.includes(capability)
    );

    if (matchingWorkers.length === 0) {
      return null;
    }

    matchingWorkers.sort((a, b) => a.currentLoad - b.currentLoad);
    return matchingWorkers[0];
  }

  /**
   * Releases a worker by removing its active lock, updating its state to IDLE,
   * clearing its active job ID, and emitting a JOB_RELEASED event.
   *
   * @param workerId - Unique ID of the worker to release
   * @throws AppError 404 if worker is not found in registry
   */
  public releaseWorker(workerId: string): void {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    this.locks.delete(workerId);
    this.registry.updateState(workerId, 'IDLE');
    this.registry.updateLoad(workerId, worker.currentLoad, null);

    this.eventBus.emit({
      type: 'JOB_RELEASED',
      workerId,
      timestamp: new Date(),
    });
  }

  /**
   * Locks a worker for execution of a specific job.
   * Verifies the worker is not already locked, updates state to BUSY,
   * increments load by 1, and associates the job ID.
   *
   * @param workerId - Unique ID of the worker to lock
   * @param jobId - ID of the job locking the worker
   * @throws AppError 409 if worker is already locked
   * @throws AppError 404 if worker is not found in registry
   */
  public lockWorker(workerId: string, jobId: string): void {
    if (this.isLocked(workerId)) {
      throw AppError.conflict(`Worker '${workerId}' is already locked`);
    }

    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    this.locks.set(workerId, jobId);
    this.registry.updateState(workerId, 'BUSY');
    this.registry.updateLoad(workerId, worker.currentLoad + 1, jobId);
  }

  /**
   * Unlocks a worker by removing its active lock, decrementing its load (min 0),
   * and clearing its active job ID. Updates state to IDLE if load drops to 0.
   *
   * @param workerId - Unique ID of the worker to unlock
   * @throws AppError 404 if worker is not found in registry
   */
  public unlockWorker(workerId: string): void {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    this.locks.delete(workerId);
    const newLoad = Math.max(0, worker.currentLoad - 1);
    this.registry.updateLoad(workerId, newLoad, null);

    if (newLoad === 0 && worker.state === 'BUSY') {
      this.registry.updateState(workerId, 'IDLE');
    }
  }

  /**
   * Checks whether a worker currently has an active lock.
   *
   * @param workerId - Unique ID of the worker to check
   * @returns True if worker is locked, false otherwise
   */
  public isLocked(workerId: string): boolean {
    return this.locks.has(workerId);
  }

  /**
   * Creates and stores a lease for a worker assignment with an expiration timestamp.
   *
   * @param workerId - Unique ID of the worker
   * @param jobId - ID of the assigned job
   * @param durationMs - Optional lease duration in milliseconds (defaults to 300,000 ms)
   * @returns Newly created WorkerLease object
   */
  public createLease(workerId: string, jobId: string, durationMs?: number): WorkerLease {
    const duration = durationMs ?? this.DEFAULT_LEASE_DURATION_MS;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration);

    const lease: WorkerLease = {
      workerId,
      jobId,
      leasedAt: now,
      expiresAt,
      renewed: 0,
    };

    this.leases.set(workerId, lease);
    return lease;
  }

  /**
   * Renews an existing worker lease by extending its expiration time and incrementing the renewed counter.
   *
   * @param workerId - Unique ID of the worker whose lease to renew
   * @param durationMs - Optional extension duration in milliseconds (defaults to 300,000 ms)
   * @returns Updated WorkerLease object
   * @throws AppError 404 if no active lease exists for worker
   */
  public renewLease(workerId: string, durationMs?: number): WorkerLease {
    const lease = this.leases.get(workerId);
    if (!lease) {
      throw AppError.notFound('Lease');
    }

    const duration = durationMs ?? this.DEFAULT_LEASE_DURATION_MS;
    lease.expiresAt = new Date(Date.now() + duration);
    lease.renewed += 1;

    this.leases.set(workerId, lease);
    return lease;
  }

  /**
   * Revokes and removes a lease associated with a worker.
   *
   * @param workerId - Unique ID of the worker whose lease to revoke
   */
  public revokeLease(workerId: string): void {
    this.leases.delete(workerId);
  }

  /**
   * Filters and returns all stored leases whose expiration timestamp is prior to the current time.
   *
   * @returns Array of expired WorkerLease objects
   */
  public getExpiredLeases(): WorkerLease[] {
    const now = new Date();
    return Array.from(this.leases.values()).filter((lease) => lease.expiresAt < now);
  }

  /**
   * Aggregates pool status statistics across all workers in the registry,
   * including state breakdown, total capacity, current load, and utilization percentage.
   *
   * @returns Aggregated PoolStatus metrics
   */
  public getPoolStatus(): PoolStatus {
    const workers = this.registry.getAllWorkers();

    let idleWorkers = 0;
    let busyWorkers = 0;
    let pausedWorkers = 0;
    let offlineWorkers = 0;
    let failedWorkers = 0;
    let totalCapacity = 0;
    let currentLoad = 0;

    for (const worker of workers) {
      switch (worker.state) {
        case 'IDLE':
          idleWorkers++;
          break;
        case 'BUSY':
          busyWorkers++;
          break;
        case 'PAUSED':
          pausedWorkers++;
          break;
        case 'OFFLINE':
          offlineWorkers++;
          break;
        case 'FAILED':
          failedWorkers++;
          break;
        default:
          break;
      }
      totalCapacity += worker.maxConcurrency;
      currentLoad += worker.currentLoad;
    }

    const utilizationPercent =
      totalCapacity > 0 ? Number(((currentLoad / totalCapacity) * 100).toFixed(2)) : 0;

    return {
      totalWorkers: workers.length,
      idleWorkers,
      busyWorkers,
      pausedWorkers,
      offlineWorkers,
      failedWorkers,
      totalCapacity,
      currentLoad,
      utilizationPercent,
    };
  }

  /**
   * Checks whether any idle worker in the pool currently has the specified capability.
   *
   * @param capability - Capability string to check
   * @returns True if capacity exists for capability, false otherwise
   */
  public hasCapacity(capability: string): boolean {
    const idleWorkers = this.registry.getWorkersByState('IDLE');
    return idleWorkers.some((worker) => worker.capabilities.includes(capability));
  }
}

export const workerPool = new WorkerPool();
