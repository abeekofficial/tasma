import { WorkerInfo, WorkerConfig, WorkerState, JobAssignment, PoolStatus, WorkerHealthReport, WorkerMetrics } from './worker.types';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { workerPool, WorkerPool } from './worker-pool';
import { workerScheduler, WorkerScheduler } from './worker-scheduler';
import { workerFactory, WorkerFactory } from './worker-factory';
import { workerLifecycleService, WorkerLifecycleService } from './worker-lifecycle.service';
import { workerHeartbeatService, WorkerHeartbeatService } from './worker-heartbeat.service';
import { workerRecoveryService, WorkerRecoveryService } from './worker-recovery.service';
import { workerHealthService, WorkerHealthService } from './worker-health.service';
import { workerMetricsService, WorkerMetricsService } from './worker-metrics.service';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';

/**
 * Central orchestrator for the Worker system.
 * Provides a unified facade over all worker subsystems: registry, pool,
 * scheduler, lifecycle, heartbeat, recovery, health, metrics, and events.
 */
export class WorkerManager {
  private readonly registry: WorkerRegistry;
  private readonly pool: WorkerPool;
  private readonly scheduler: WorkerScheduler;
  private readonly factory: WorkerFactory;
  private readonly lifecycle: WorkerLifecycleService;
  private readonly heartbeat: WorkerHeartbeatService;
  private readonly recovery: WorkerRecoveryService;
  private readonly health: WorkerHealthService;
  private readonly metrics: WorkerMetricsService;
  private readonly eventBus: WorkerEventBus;
  private initialized: boolean;

  constructor(
    registry: WorkerRegistry = workerRegistry,
    pool: WorkerPool = workerPool,
    scheduler: WorkerScheduler = workerScheduler,
    factory: WorkerFactory = workerFactory,
    lifecycle: WorkerLifecycleService = workerLifecycleService,
    heartbeat: WorkerHeartbeatService = workerHeartbeatService,
    recovery: WorkerRecoveryService = workerRecoveryService,
    health: WorkerHealthService = workerHealthService,
    metrics: WorkerMetricsService = workerMetricsService,
    eventBus: WorkerEventBus = workerEventBus
  ) {
    this.registry = registry;
    this.pool = pool;
    this.scheduler = scheduler;
    this.factory = factory;
    this.lifecycle = lifecycle;
    this.heartbeat = heartbeat;
    this.recovery = recovery;
    this.health = health;
    this.metrics = metrics;
    this.eventBus = eventBus;
    this.initialized = false;
  }

  // ──────────────────────────────────────────────
  // Initialization & Shutdown
  // ──────────────────────────────────────────────

  /**
   * Initializes the worker manager, starts heartbeat monitoring,
   * and wires up internal event listeners.
   */
  public initialize(): void {
    if (this.initialized) return;

    this.heartbeat.startMonitoring();
    this.setupEventListeners();
    this.initialized = true;
  }

  /**
   * Gracefully shuts down all workers and stops monitoring.
   */
  public async shutdown(): Promise<number> {
    this.heartbeat.stopMonitoring();
    const count = await this.lifecycle.gracefulShutdownAll();
    this.initialized = false;
    return count;
  }

  // ──────────────────────────────────────────────
  // Worker Registration
  // ──────────────────────────────────────────────

  /**
   * Creates and registers a new worker with the given configuration.
   */
  public createWorker(config: Partial<WorkerConfig> = {}): WorkerInfo {
    const worker = this.factory.createWorker(config);
    this.metrics.initializeMetrics(worker.id);
    return worker;
  }

  /**
   * Creates a pool of workers with similar configuration.
   */
  public createWorkerPool(count: number, baseConfig?: Partial<WorkerConfig>): WorkerInfo[] {
    const workers = this.factory.createWorkerPool(count, baseConfig);
    for (const worker of workers) {
      this.metrics.initializeMetrics(worker.id);
    }
    return workers;
  }

  /**
   * Creates a worker specialized for a single capability.
   */
  public createSpecializedWorker(capability: string, config?: Partial<WorkerConfig>): WorkerInfo {
    const worker = this.factory.createSpecializedWorker(capability, config);
    this.metrics.initializeMetrics(worker.id);
    return worker;
  }

  /**
   * Unregisters a worker, cleaning up all associated state.
   */
  public removeWorker(workerId: string): boolean {
    const assignment = this.scheduler.getWorkerAssignment(workerId);
    if (assignment) {
      this.scheduler.releaseJob(assignment.jobId);
    }
    this.pool.revokeLease(workerId);
    return this.registry.unregister(workerId);
  }

  // ──────────────────────────────────────────────
  // Worker Discovery & Lookup
  // ──────────────────────────────────────────────

  /** Returns a worker by ID. */
  public getWorker(workerId: string): WorkerInfo | undefined {
    return this.registry.getWorker(workerId);
  }

  /** Returns all registered workers. */
  public getAllWorkers(): WorkerInfo[] {
    return this.registry.getAllWorkers();
  }

  /** Finds workers by state. */
  public getWorkersByState(state: WorkerState): WorkerInfo[] {
    return this.registry.getWorkersByState(state);
  }

  /** Finds workers with a specific capability. */
  public getWorkersByCapability(capability: string): WorkerInfo[] {
    return this.registry.getWorkersByCapability(capability);
  }

  /** Returns the total number of registered workers. */
  public getWorkerCount(): number {
    return this.registry.getWorkerCount();
  }

  // ──────────────────────────────────────────────
  // Worker Lifecycle
  // ──────────────────────────────────────────────

  /** Starts a worker, setting it to IDLE state. */
  public startWorker(workerId: string): WorkerInfo {
    return this.lifecycle.startWorker(workerId);
  }

  /** Stops a worker. Throws if it has an active job. */
  public stopWorker(workerId: string): WorkerInfo {
    return this.lifecycle.stopWorker(workerId);
  }

  /** Pauses an idle worker. */
  public pauseWorker(workerId: string): WorkerInfo {
    return this.lifecycle.pauseWorker(workerId);
  }

  /** Resumes a paused worker. */
  public resumeWorker(workerId: string): WorkerInfo {
    return this.lifecycle.resumeWorker(workerId);
  }

  /** Restarts a worker (stop + start). */
  public restartWorker(workerId: string): WorkerInfo {
    return this.lifecycle.restartWorker(workerId);
  }

  /** Gracefully shuts down a single worker. */
  public async gracefulShutdown(workerId: string): Promise<WorkerInfo> {
    return this.lifecycle.gracefulShutdown(workerId);
  }

  /** Marks a worker as failed. */
  public markWorkerFailed(workerId: string, reason?: string): WorkerInfo {
    return this.lifecycle.markFailed(workerId, reason);
  }

  // ──────────────────────────────────────────────
  // Job Assignment & Scheduling
  // ──────────────────────────────────────────────

  /** Assigns a job to the best available worker. Returns null if no worker is available. */
  public assignJob(jobId: string, type: string, priority: string): JobAssignment | null {
    const assignment = this.scheduler.assignJob(jobId, type, priority);
    if (assignment) {
      this.metrics.recordJobStarted(assignment.workerId);
    }
    return assignment;
  }

  /** A worker explicitly claims a job. */
  public claimJob(workerId: string, jobId: string, type: string, priority: string): JobAssignment {
    const assignment = this.scheduler.claimJob(workerId, jobId, type, priority);
    this.metrics.recordJobStarted(workerId);
    return assignment;
  }

  /** Releases a job assignment, freeing the worker. */
  public releaseJob(jobId: string): void {
    this.scheduler.releaseJob(jobId);
  }

  /** Requeues a job, putting it back in the pending queue. */
  public requeueJob(jobId: string): void {
    this.scheduler.requeueJob(jobId);
  }

  /**
   * Marks a job as completed, records metrics, and frees the worker.
   */
  public completeJob(jobId: string, durationMs: number): void {
    const assignment = this.scheduler.getAssignment(jobId);
    if (assignment) {
      this.metrics.recordJobCompleted(assignment.workerId, durationMs);
    }
    this.scheduler.completeJob(jobId);
  }

  /**
   * Marks a job as failed, records metrics, and frees the worker.
   */
  public failJob(jobId: string): void {
    const assignment = this.scheduler.getAssignment(jobId);
    if (assignment) {
      this.metrics.recordJobFailed(assignment.workerId);
    }
    this.scheduler.failJob(jobId);
  }

  /** Returns the assignment for a job ID. */
  public getAssignment(jobId: string): JobAssignment | undefined {
    return this.scheduler.getAssignment(jobId);
  }

  /** Returns all active assignments. */
  public getActiveAssignments(): JobAssignment[] {
    return this.scheduler.getActiveAssignments();
  }

  /** Returns the number of pending (unassigned) jobs. */
  public getPendingJobCount(): number {
    return this.scheduler.getPendingCount();
  }

  /** Checks if a worker with the required capability is available. */
  public hasCapacity(capability: string): boolean {
    return this.pool.hasCapacity(capability);
  }

  // ──────────────────────────────────────────────
  // Heartbeat
  // ──────────────────────────────────────────────

  /** Records a heartbeat from a worker. */
  public recordHeartbeat(workerId: string): void {
    this.heartbeat.recordHeartbeat(workerId);
  }

  /** Configures heartbeat timeout for a specific worker. */
  public setHeartbeatTimeout(workerId: string, timeoutMs: number): void {
    this.heartbeat.setHeartbeatTimeout(workerId, timeoutMs);
  }

  // ──────────────────────────────────────────────
  // Recovery
  // ──────────────────────────────────────────────

  /** Recovers a failed or offline worker. */
  public recoverWorker(workerId: string): WorkerInfo {
    return this.recovery.recoverWorker(workerId);
  }

  /** Recovers all failed workers. */
  public recoverAllFailed(): number {
    return this.recovery.recoverAllFailed();
  }

  /** Recovers stale workers based on heartbeat timeout. */
  public recoverStaleWorkers(timeoutMs?: number): number {
    return this.recovery.recoverStaleWorkers(timeoutMs);
  }

  /** Handles expired leases by releasing associated jobs. */
  public handleExpiredLeases(): number {
    return this.recovery.handleExpiredLeases();
  }

  /** Requeues jobs assigned to offline/failed workers. */
  public requeueOrphanedJobs(): number {
    return this.recovery.requeueOrphanedJobs();
  }

  /**
   * Performs a full maintenance cycle: recover stale workers,
   * handle expired leases, requeue orphaned jobs.
   */
  public performMaintenance(): { recoveredWorkers: number; expiredLeases: number; requeuedJobs: number } {
    const recoveredWorkers = this.recovery.recoverStaleWorkers();
    const expiredLeases = this.recovery.handleExpiredLeases();
    const requeuedJobs = this.recovery.requeueOrphanedJobs();
    return { recoveredWorkers, expiredLeases, requeuedJobs };
  }

  // ──────────────────────────────────────────────
  // Health & Diagnostics
  // ──────────────────────────────────────────────

  /** Checks health of a single worker. */
  public checkWorkerHealth(workerId: string): WorkerHealthReport {
    return this.health.checkWorkerHealth(workerId);
  }

  /** Checks health of all workers. */
  public checkAllWorkerHealth(): WorkerHealthReport[] {
    return this.health.checkAllWorkerHealth();
  }

  /** Returns comprehensive pool health status. */
  public getPoolHealth(): { healthy: boolean; poolStatus: PoolStatus; unhealthyWorkers: WorkerHealthReport[]; issues: string[] } {
    return this.health.getPoolHealth();
  }

  /** Returns pool capacity summary. */
  public getPoolStatus(): PoolStatus {
    return this.pool.getPoolStatus();
  }

  /** Returns true if the worker system is healthy. */
  public isSystemHealthy(): boolean {
    return this.health.isSystemHealthy();
  }

  // ──────────────────────────────────────────────
  // Metrics
  // ──────────────────────────────────────────────

  /** Returns metrics for a single worker. */
  public getWorkerMetrics(workerId: string): WorkerMetrics | undefined {
    return this.metrics.getMetrics(workerId);
  }

  /** Returns metrics for all workers. */
  public getAllMetrics(): WorkerMetrics[] {
    return this.metrics.getAllMetrics();
  }

  /** Returns aggregate metrics across all workers. */
  public getAggregateMetrics(): {
    totalProcessed: number;
    totalCompleted: number;
    totalFailed: number;
    averageProcessingTimeMs: number;
    successRate: number;
    failureRate: number;
    workerCount: number;
  } {
    return this.metrics.getAggregateMetrics();
  }

  /** Updates resource usage for a worker (CPU, memory). */
  public updateResourceUsage(workerId: string, cpuUsage: number, memoryUsageMb: number): void {
    this.metrics.updateResourceUsage(workerId, cpuUsage, memoryUsageMb);
  }

  // ──────────────────────────────────────────────
  // Events
  // ──────────────────────────────────────────────

  /** Returns event bus for external listeners to subscribe. */
  public getEventBus(): WorkerEventBus {
    return this.eventBus;
  }

  // ──────────────────────────────────────────────
  // Private
  // ──────────────────────────────────────────────

  /**
   * Wires up internal event listeners for automated recovery and metrics tracking.
   */
  private setupEventListeners(): void {
    this.eventBus.on('WORKER_TIMEOUT', (event) => {
      this.lifecycle.markFailed(event.workerId, 'heartbeat_timeout');
    });

    this.eventBus.on('JOB_COMPLETED', (event) => {
      if (event.data?.durationMs) {
        this.metrics.recordJobCompleted(event.workerId, event.data.durationMs as number);
      }
    });

    this.eventBus.on('JOB_FAILED', (event) => {
      this.metrics.recordJobFailed(event.workerId);
    });

    this.eventBus.on('WORKER_REGISTERED', (event) => {
      this.metrics.initializeMetrics(event.workerId);
    });
  }
}

export const workerManager = new WorkerManager();
