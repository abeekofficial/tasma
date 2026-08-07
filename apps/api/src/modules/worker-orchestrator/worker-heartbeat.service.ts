import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { WorkerInfo } from './worker.types';

export const DEFAULT_HEARTBEAT_INTERVAL_MS = 30000; // 30 seconds
export const DEFAULT_HEARTBEAT_TIMEOUT_MS = 90000; // 90 seconds
export const DEFAULT_CHECK_INTERVAL_MS = 15000; // 15 seconds

/**
 * WorkerHeartbeatService monitors worker node health and heartbeat signals,
 * tracks individual worker timeouts, and emits lifecycle events for missed heartbeats or timeouts.
 */
export class WorkerHeartbeatService {
  private readonly registry: WorkerRegistry;
  private readonly eventBus: WorkerEventBus;
  private readonly heartbeatTimeouts: Map<string, number>; // workerId -> timeoutMs
  private monitorInterval: ReturnType<typeof setInterval> | null;
  private readonly checkIntervalMs: number;

  /**
   * Initializes a new WorkerHeartbeatService instance.
   *
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param eventBus - WorkerEventBus instance (defaults to singleton workerEventBus)
   * @param checkIntervalMs - Interval in milliseconds between heartbeat check cycles (defaults to 15000 ms)
   */
  constructor(
    registry: WorkerRegistry = workerRegistry,
    eventBus: WorkerEventBus = workerEventBus,
    checkIntervalMs: number = DEFAULT_CHECK_INTERVAL_MS
  ) {
    this.registry = registry;
    this.eventBus = eventBus;
    this.heartbeatTimeouts = new Map<string, number>();
    this.monitorInterval = null;
    this.checkIntervalMs = checkIntervalMs;
  }

  /**
   * Records a heartbeat for a registered worker.
   * Updates the worker's lastHeartbeat timestamp in the registry and emits a WORKER_HEARTBEAT event.
   *
   * @param workerId - Unique ID of the worker recording heartbeat
   * @throws AppError 404 if worker is not found in registry
   */
  public recordHeartbeat(workerId: string): void {
    const updatedWorker = this.registry.updateHeartbeat(workerId);

    this.eventBus.emit({
      type: 'WORKER_HEARTBEAT',
      workerId,
      timestamp: new Date(),
      data: {
        lastHeartbeat: updatedWorker.lastHeartbeat,
      },
    });
  }

  /**
   * Configures a custom heartbeat timeout for a specific worker.
   *
   * @param workerId - Unique ID of the worker
   * @param timeoutMs - Timeout duration in milliseconds
   */
  public setHeartbeatTimeout(workerId: string, timeoutMs: number): void {
    this.heartbeatTimeouts.set(workerId, timeoutMs);
  }

  /**
   * Retrieves the configured heartbeat timeout for a worker, returning DEFAULT_HEARTBEAT_TIMEOUT_MS if not set.
   *
   * @param workerId - Unique ID of the worker
   * @returns Configured or default heartbeat timeout in milliseconds
   */
  public getHeartbeatTimeout(workerId: string): number {
    return this.heartbeatTimeouts.get(workerId) ?? DEFAULT_HEARTBEAT_TIMEOUT_MS;
  }

  /**
   * Checks whether a worker's heartbeat has expired based on its last heartbeat timestamp and timeout setting.
   *
   * @param workerId - Unique ID of the worker
   * @returns True if worker exists and heartbeat has expired, false otherwise
   */
  public isHeartbeatExpired(workerId: string): boolean {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      return false;
    }

    const timeout = this.getHeartbeatTimeout(workerId);
    const elapsed = Date.now() - worker.lastHeartbeat.getTime();

    return elapsed > timeout;
  }

  /**
   * Calculates the elapsed time in milliseconds since the worker's last recorded heartbeat.
   *
   * @param workerId - Unique ID of the worker
   * @returns Elapsed time in milliseconds
   * @throws AppError 404 if worker is not found in registry
   */
  public getTimeSinceLastHeartbeat(workerId: string): number {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    return Date.now() - worker.lastHeartbeat.getTime();
  }

  /**
   * Starts periodic monitoring of all registered worker heartbeats.
   * If monitoring is already active, this method is a no-op.
   */
  public startMonitoring(): void {
    if (this.monitorInterval) {
      return;
    }

    this.monitorInterval = setInterval(() => {
      this.checkAllHeartbeats();
    }, this.checkIntervalMs);
  }

  /**
   * Stops periodic monitoring of worker heartbeats and clears the active timer interval.
   */
  public stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  /**
   * Checks all registered workers and emits events for missed heartbeats or timeouts.
   * Skips workers in OFFLINE or FAILED state. Emits WORKER_HEARTBEAT_MISSED if heartbeat is expired,
   * and WORKER_TIMEOUT if heartbeat is expired beyond 2x the configured timeout.
   */
  private checkAllHeartbeats(): void {
    const workers = this.registry.getAllWorkers();
    const now = Date.now();

    for (const worker of workers) {
      if (worker.state === 'OFFLINE' || worker.state === 'FAILED') {
        continue;
      }

      const timeout = this.getHeartbeatTimeout(worker.id);
      const elapsed = now - worker.lastHeartbeat.getTime();

      if (elapsed > timeout) {
        this.eventBus.emit({
          type: 'WORKER_HEARTBEAT_MISSED',
          workerId: worker.id,
          timestamp: new Date(),
          data: {
            elapsed,
            timeout,
            lastHeartbeat: worker.lastHeartbeat,
          },
        });
      }

      if (elapsed > 2 * timeout) {
        this.eventBus.emit({
          type: 'WORKER_TIMEOUT',
          workerId: worker.id,
          timestamp: new Date(),
          data: {
            elapsed,
            timeout,
            lastHeartbeat: worker.lastHeartbeat,
          },
        });
      }
    }
  }

  /**
   * Retrieves all registered workers whose heartbeat has expired.
   *
   * @returns Array of WorkerInfo objects with expired heartbeats
   */
  public getStaleWorkers(): WorkerInfo[] {
    return this.registry.getAllWorkers().filter((worker) => this.isHeartbeatExpired(worker.id));
  }
}

export const workerHeartbeatService = new WorkerHeartbeatService();
