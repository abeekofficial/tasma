import { AppError } from '@/shared/errors/app-error';
import { workerEventBus, WorkerEventBus } from './worker-event-bus';
import { workerPool, WorkerPool } from './worker-pool';
import { workerRegistry, WorkerRegistry } from './worker-registry';
import { JobAssignment } from './worker.types';

const TYPE_CAPABILITY_MAP: Record<string, string> = {
  PREVIEW: 'PREVIEW',
  EXPORT: 'EXPORT',
  THUMBNAIL: 'THUMBNAIL',
  SOCIAL_PUBLISH: 'SOCIAL_PUBLISH',
};

const PRIORITY_WEIGHT: Record<string, number> = {
  URGENT: 4,
  HIGH: 3,
  NORMAL: 2,
  LOW: 1,
};

/**
 * WorkerScheduler manages job assignments, claiming, priority scheduling,
 * queue selection, and background processing of pending job queues.
 */
export class WorkerScheduler {
  private readonly pool: WorkerPool;
  private readonly registry: WorkerRegistry;
  private readonly eventBus: WorkerEventBus;
  private readonly assignments: Map<string, JobAssignment>;
  private readonly pendingQueue: Array<{
    jobId: string;
    type: string;
    priority: string;
    queuedAt: Date;
  }>;

  /**
   * Initializes a new WorkerScheduler instance.
   *
   * @param pool - WorkerPool instance (defaults to singleton workerPool)
   * @param registry - WorkerRegistry instance (defaults to singleton workerRegistry)
   * @param eventBus - WorkerEventBus instance (defaults to singleton workerEventBus)
   */
  constructor(
    pool: WorkerPool = workerPool,
    registry: WorkerRegistry = workerRegistry,
    eventBus: WorkerEventBus = workerEventBus
  ) {
    this.pool = pool;
    this.registry = registry;
    this.eventBus = eventBus;
    this.assignments = new Map<string, JobAssignment>();
    this.pendingQueue = [];
  }

  /**
   * Assigns a job to an available worker matching the job type capability.
   * If a suitable worker is available, locks the worker, creates a job assignment and lease,
   * and emits a JOB_ASSIGNED event. If no worker is available, adds the job to the pending queue
   * sorted by priority and returns null.
   *
   * @param jobId - Unique identifier for the job
   * @param type - Job type string (mapped to capability)
   * @param priority - Priority level (URGENT, HIGH, NORMAL, LOW)
   * @returns JobAssignment object if assigned, or null if queued
   */
  public assignJob(jobId: string, type: string, priority: string): JobAssignment | null {
    const capability =
      TYPE_CAPABILITY_MAP[type.toUpperCase()] ?? TYPE_CAPABILITY_MAP[type] ?? type;

    const worker = this.pool.acquireWorker(capability, priority);

    if (worker) {
      this.pool.lockWorker(worker.id, jobId);

      const assignment: JobAssignment = {
        jobId,
        workerId: worker.id,
        assignedAt: new Date(),
        priority,
        type,
      };

      this.assignments.set(jobId, assignment);
      this.pool.createLease(worker.id, jobId);

      this.eventBus.emit({
        type: 'JOB_ASSIGNED',
        workerId: worker.id,
        timestamp: new Date(),
        data: { jobId, assignment, priority, type },
      });

      return assignment;
    }

    this.pendingQueue.push({
      jobId,
      type,
      priority,
      queuedAt: new Date(),
    });

    this.sortPendingQueue();
    return null;
  }

  /**
   * Claims a job for a specific worker after verifying the worker exists and is currently IDLE.
   * Locks the worker, creates the assignment and lease, and emits a JOB_CLAIMED event.
   *
   * @param workerId - Unique ID of the worker claiming the job
   * @param jobId - Unique ID of the job being claimed
   * @param type - Job type
   * @param priority - Priority level
   * @returns Newly created JobAssignment object
   * @throws AppError 404 if worker is not found
   * @throws AppError 400 if worker is not idle
   */
  public claimJob(
    workerId: string,
    jobId: string,
    type: string,
    priority: string
  ): JobAssignment {
    const worker = this.registry.getWorker(workerId);
    if (!worker) {
      throw AppError.notFound('Worker');
    }

    if (worker.state !== 'IDLE') {
      throw AppError.badRequest(`Worker '${workerId}' is not idle`);
    }

    this.pool.lockWorker(workerId, jobId);

    const assignment: JobAssignment = {
      jobId,
      workerId,
      assignedAt: new Date(),
      priority,
      type,
    };

    this.assignments.set(jobId, assignment);
    this.pool.createLease(workerId, jobId);

    this.eventBus.emit({
      type: 'JOB_CLAIMED',
      workerId,
      timestamp: new Date(),
      data: { jobId, assignment, priority, type },
    });

    return assignment;
  }

  /**
   * Releases an active job assignment, unlocks and releases the associated worker,
   * removes the assignment, emits a JOB_RELEASED event, and processes any pending queued jobs.
   *
   * @param jobId - Unique ID of the job to release
   * @throws AppError 404 if job assignment is not found
   */
  public releaseJob(jobId: string): void {
    const assignment = this.assignments.get(jobId);
    if (!assignment) {
      throw AppError.notFound('Job assignment');
    }

    if (this.registry.hasWorker(assignment.workerId)) {
      this.pool.unlockWorker(assignment.workerId);
      this.pool.releaseWorker(assignment.workerId);
    }
    this.pool.revokeLease(assignment.workerId);

    this.assignments.delete(jobId);

    this.eventBus.emit({
      type: 'JOB_RELEASED',
      workerId: assignment.workerId,
      timestamp: new Date(),
      data: { jobId, assignment },
    });

    this.processPendingQueue();
  }

  /**
   * Requeues an active job, releasing its current worker, removing the assignment,
   * pushing the job back to the pending queue, emitting a JOB_REQUEUED event, and processing the queue.
   *
   * @param jobId - Unique ID of the job to requeue
   * @throws AppError 404 if job assignment is not found
   */
  public requeueJob(jobId: string): void {
    const assignment = this.assignments.get(jobId);
    if (!assignment) {
      throw AppError.notFound('Job assignment');
    }

    if (this.registry.hasWorker(assignment.workerId)) {
      this.pool.unlockWorker(assignment.workerId);
      this.pool.releaseWorker(assignment.workerId);
    }
    this.pool.revokeLease(assignment.workerId);

    this.assignments.delete(jobId);

    this.pendingQueue.push({
      jobId: assignment.jobId,
      type: assignment.type,
      priority: assignment.priority,
      queuedAt: new Date(),
    });

    this.sortPendingQueue();

    this.eventBus.emit({
      type: 'JOB_REQUEUED',
      workerId: assignment.workerId,
      timestamp: new Date(),
      data: { jobId, assignment },
    });

    this.processPendingQueue();
  }

  /**
   * Completes an active job, unlocks and releases the worker, removes the assignment,
   * emits a JOB_COMPLETED event, and processes the pending job queue.
   *
   * @param jobId - Unique ID of the completed job
   * @throws AppError 404 if job assignment is not found
   */
  public completeJob(jobId: string): void {
    const assignment = this.assignments.get(jobId);
    if (!assignment) {
      throw AppError.notFound('Job assignment');
    }

    if (this.registry.hasWorker(assignment.workerId)) {
      this.pool.unlockWorker(assignment.workerId);
      this.pool.releaseWorker(assignment.workerId);
    }
    this.pool.revokeLease(assignment.workerId);

    this.assignments.delete(jobId);

    this.eventBus.emit({
      type: 'JOB_COMPLETED',
      workerId: assignment.workerId,
      timestamp: new Date(),
      data: { jobId, assignment },
    });

    this.processPendingQueue();
  }

  /**
   * Marks an active job as failed, unlocks and releases the worker, removes the assignment,
   * emits a JOB_FAILED event, and processes the pending job queue.
   *
   * @param jobId - Unique ID of the failed job
   * @throws AppError 404 if job assignment is not found
   */
  public failJob(jobId: string): void {
    const assignment = this.assignments.get(jobId);
    if (!assignment) {
      throw AppError.notFound('Job assignment');
    }

    if (this.registry.hasWorker(assignment.workerId)) {
      this.pool.unlockWorker(assignment.workerId);
      this.pool.releaseWorker(assignment.workerId);
    }
    this.pool.revokeLease(assignment.workerId);

    this.assignments.delete(jobId);

    this.eventBus.emit({
      type: 'JOB_FAILED',
      workerId: assignment.workerId,
      timestamp: new Date(),
      data: { jobId, assignment },
    });

    this.processPendingQueue();
  }

  /**
   * Retrieves the current job assignment for a given job ID.
   *
   * @param jobId - Unique ID of the job
   * @returns JobAssignment object if found, undefined otherwise
   */
  public getAssignment(jobId: string): JobAssignment | undefined {
    return this.assignments.get(jobId);
  }

  /**
   * Retrieves the active job assignment for a specific worker ID.
   *
   * @param workerId - Unique ID of the worker
   * @returns JobAssignment object if found, undefined otherwise
   */
  public getWorkerAssignment(workerId: string): JobAssignment | undefined {
    return Array.from(this.assignments.values()).find(
      (assignment) => assignment.workerId === workerId
    );
  }

  /**
   * Gets the total count of jobs currently waiting in the pending queue.
   *
   * @returns Number of pending jobs
   */
  public getPendingCount(): number {
    return this.pendingQueue.length;
  }

  /**
   * Retrieves all currently active job assignments.
   *
   * @returns Array of active JobAssignment objects
   */
  public getActiveAssignments(): JobAssignment[] {
    return Array.from(this.assignments.values());
  }

  /**
   * Checks whether the pool currently has capacity for workers supporting the given job type.
   *
   * @param type - Job type string
   * @returns True if affinity worker with capacity exists, false otherwise
   */
  public hasAffinityWorker(type: string): boolean {
    const capability =
      TYPE_CAPABILITY_MAP[type.toUpperCase()] ?? TYPE_CAPABILITY_MAP[type] ?? type;
    return this.pool.hasCapacity(capability);
  }

  /**
   * Processes the pending queue by sorting queued jobs by priority and queued time,
   * then attempting to assign each job to an available worker.
   */
  private processPendingQueue(): void {
    this.sortPendingQueue();

    const remainingQueue: Array<{
      jobId: string;
      type: string;
      priority: string;
      queuedAt: Date;
    }> = [];

    for (const pendingJob of [...this.pendingQueue]) {
      const capability =
        TYPE_CAPABILITY_MAP[pendingJob.type.toUpperCase()] ??
        TYPE_CAPABILITY_MAP[pendingJob.type] ??
        pendingJob.type;

      const worker = this.pool.acquireWorker(capability, pendingJob.priority);

      if (worker) {
        this.pool.lockWorker(worker.id, pendingJob.jobId);

        const assignment: JobAssignment = {
          jobId: pendingJob.jobId,
          workerId: worker.id,
          assignedAt: new Date(),
          priority: pendingJob.priority,
          type: pendingJob.type,
        };

        this.assignments.set(pendingJob.jobId, assignment);
        this.pool.createLease(worker.id, pendingJob.jobId);

        this.eventBus.emit({
          type: 'JOB_ASSIGNED',
          workerId: worker.id,
          timestamp: new Date(),
          data: {
            jobId: pendingJob.jobId,
            assignment,
            priority: pendingJob.priority,
            type: pendingJob.type,
          },
        });
      } else {
        remainingQueue.push(pendingJob);
      }
    }

    this.pendingQueue.length = 0;
    this.pendingQueue.push(...remainingQueue);
  }

  /**
   * Sorts the pending queue in place:
   * First by priority weight in descending order (URGENT > HIGH > NORMAL > LOW),
   * then by queuedAt timestamp in ascending order (FIFO for equal priority).
   */
  private sortPendingQueue(): void {
    this.pendingQueue.sort((a, b) => {
      const weightA =
        PRIORITY_WEIGHT[a.priority.toUpperCase()] ?? PRIORITY_WEIGHT[a.priority] ?? 0;
      const weightB =
        PRIORITY_WEIGHT[b.priority.toUpperCase()] ?? PRIORITY_WEIGHT[b.priority] ?? 0;

      if (weightB !== weightA) {
        return weightB - weightA;
      }

      return a.queuedAt.getTime() - b.queuedAt.getTime();
    });
  }
}

export const workerScheduler = new WorkerScheduler();
