import { v4 as uuid } from 'uuid';
import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { WorkerConfig, WorkerInfo, WorkerState } from './worker.types';

/**
 * In-memory worker registry that tracks all registered workers,
 * handles state updates, heartbeats, load metrics, and emits worker events.
 */
export class WorkerRegistry {
  private readonly workers: Map<string, WorkerInfo>;
  private readonly eventBus: WorkerEventBus;

  /**
   * Initializes a new WorkerRegistry instance.
   *
   * @param eventBus - Event bus for emitting worker lifecycle events (defaults to singleton workerEventBus)
   */
  constructor(eventBus: WorkerEventBus = workerEventBus) {
    this.workers = new Map<string, WorkerInfo>();
    this.eventBus = eventBus;
  }

  /**
   * Registers a new worker in memory with a generated UUID, sets initial state to IDLE,
   * stores worker details, and emits the WORKER_REGISTERED event.
   *
   * @param config - Configuration options for registering the worker
   * @returns Newly created WorkerInfo object
   */
  public register(config: WorkerConfig): WorkerInfo {
    const now = new Date();
    const worker: WorkerInfo = {
      id: uuid(),
      name: config.name,
      state: 'IDLE',
      capabilities: [...config.capabilities],
      maxConcurrency: config.maxConcurrency ?? 1,
      currentLoad: 0,
      currentJobId: null,
      lastHeartbeat: now,
      registeredAt: now,
      metadata: config.metadata ? { ...config.metadata } : {},
    };

    this.workers.set(worker.id, worker);

    this.eventBus.emit({
      type: 'WORKER_REGISTERED',
      workerId: worker.id,
      timestamp: new Date(),
      data: { config, worker },
    });

    return worker;
  }

  /**
   * Unregisters a worker by removing it from the registry map and emitting the WORKER_UNREGISTERED event.
   *
   * @param workerId - Unique ID of the worker to unregister
   * @returns True if worker was removed
   * @throws AppError 404 if workerId is not found
   */
  public unregister(workerId: string): boolean {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    const removed = this.workers.delete(workerId);

    if (removed) {
      this.eventBus.emit({
        type: 'WORKER_UNREGISTERED',
        workerId,
        timestamp: new Date(),
        data: { worker },
      });
    }

    return removed;
  }

  /**
   * Retrieves a registered worker by ID.
   *
   * @param workerId - Unique ID of the worker
   * @returns WorkerInfo object if found, undefined otherwise
   */
  public getWorker(workerId: string): WorkerInfo | undefined {
    return this.workers.get(workerId);
  }

  /**
   * Retrieves all registered workers as an array.
   *
   * @returns Array of all registered WorkerInfo objects
   */
  public getAllWorkers(): WorkerInfo[] {
    return Array.from(this.workers.values());
  }

  /**
   * Retrieves all workers matching the specified operational state.
   *
   * @param state - WorkerState to filter by
   * @returns Array of matching WorkerInfo objects
   */
  public getWorkersByState(state: WorkerState): WorkerInfo[] {
    return Array.from(this.workers.values()).filter((worker) => worker.state === state);
  }

  /**
   * Retrieves all workers that possess the specified capability.
   *
   * @param capability - Capability string to filter by
   * @returns Array of matching WorkerInfo objects
   */
  public getWorkersByCapability(capability: string): WorkerInfo[] {
    return Array.from(this.workers.values()).filter((worker) =>
      worker.capabilities.includes(capability)
    );
  }

  /**
   * Updates the operational state of a worker and emits the WORKER_STATE_CHANGED event.
   *
   * @param workerId - Unique ID of the worker
   * @param state - New state to apply
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if workerId is not found
   */
  public updateState(workerId: string, state: WorkerState): WorkerInfo {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    const previousState = worker.state;
    worker.state = state;

    this.eventBus.emit({
      type: 'WORKER_STATE_CHANGED',
      workerId,
      timestamp: new Date(),
      data: { previousState, newState: state },
    });

    return worker;
  }

  /**
   * Updates the last heartbeat timestamp of a worker to the current Date.
   *
   * @param workerId - Unique ID of the worker
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if workerId is not found
   */
  public updateHeartbeat(workerId: string): WorkerInfo {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    worker.lastHeartbeat = new Date();
    return worker;
  }

  /**
   * Updates the current load and active job ID for a worker.
   *
   * @param workerId - Unique ID of the worker
   * @param currentLoad - Current load value
   * @param currentJobId - Active job ID or null if idle
   * @returns Updated WorkerInfo object
   * @throws AppError 404 if workerId is not found
   */
  public updateLoad(
    workerId: string,
    currentLoad: number,
    currentJobId: string | null
  ): WorkerInfo {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    worker.currentLoad = currentLoad;
    worker.currentJobId = currentJobId;
    return worker;
  }

  /**
   * Gets the total number of currently registered workers.
   *
   * @returns Total worker count
   */
  public getWorkerCount(): number {
    return this.workers.size;
  }

  /**
   * Checks whether a worker exists in the registry.
   *
   * @param workerId - Unique ID of the worker
   * @returns True if worker exists, false otherwise
   */
  public hasWorker(workerId: string): boolean {
    return this.workers.has(workerId);
  }

  /**
   * Clears all workers from the in-memory registry map.
   */
  public clear(): void {
    this.workers.clear();
  }
}

export const workerRegistry = new WorkerRegistry();
