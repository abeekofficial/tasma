import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '@/shared/errors/app-error';

/**
 * Represents the various states a render job can be in.
 */
export enum JobStatus {
  QUEUED = 'QUEUED',
  RENDERING = 'RENDERING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

/**
 * Domain model for a render job.
 */
export interface RenderJob {
  id: string;
  projectId: string;
  priority: number;
  status: JobStatus;
  attempts: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface defining the external database operations required by the RenderQueueService.
 */
export interface DatabaseClient {
  renderJob: {
    create(data: { data: Partial<RenderJob> }): Promise<RenderJob>;
    update(data: { where: { id: string }; data: Partial<RenderJob> }): Promise<RenderJob>;
    findFirst(query: { where: Partial<RenderJob>; orderBy: { priority: 'desc' | 'asc' } }): Promise<RenderJob | null>;
  };
}

/**
 * Interface defining the external render engine operations.
 */
export interface RenderEngineClient {
  startProcess(jobId: string): Promise<void>;
  cancelProcess(jobId: string): Promise<void>;
}

/**
 * Service responsible for managing the queuing, processing, and lifecycle of render jobs.
 */
export class RenderQueueService {
  private readonly maxRetries = 3;

  /**
   * Initializes the RenderQueueService with required dependencies.
   *
   * @param db - The database client instance.
   * @param renderEngine - The render engine client instance.
   */
  constructor(
    private readonly db: DatabaseClient,
    private readonly renderEngine: RenderEngineClient
  ) {}

  /**
   * Queues a new render job for a given project.
   *
   * @param projectId - The unique identifier of the project to render.
   * @param priority - The priority level of the job (higher number means higher priority). Defaults to 0.
   * @returns A promise that resolves to the newly created RenderJob.
   * @throws {AppError} If the projectId is missing or invalid.
   */
  public async queueJob(projectId: string, priority: number = 0): Promise<RenderJob> {
    if (!projectId || projectId.trim() === '') {
      throw new AppError('Project ID is required', 400);
    }

    const job = await this.db.renderJob.create({
      data: {
        projectId,
        priority,
        status: JobStatus.QUEUED,
        attempts: 0,
      }
    });

    return job;
  }

  /**
   * Processes the next available queued job based on priority.
   * Handles state transitions from QUEUED to RENDERING, and subsequently to COMPLETED or FAILED.
   *
   * @returns A promise that resolves to the processed RenderJob, or null if no queued jobs exist.
   */
  public async processNext(): Promise<RenderJob | null> {
    const job = await this.db.renderJob.findFirst({
      where: { status: JobStatus.QUEUED },
      orderBy: { priority: 'desc' }
    });

    if (!job) {
      return null;
    }

    const renderingJob = await this.db.renderJob.update({
      where: { id: job.id },
      data: { 
        status: JobStatus.RENDERING, 
        attempts: job.attempts + 1 
      }
    });

    try {
      await this.renderEngine.startProcess(renderingJob.id);
      
      return await this.db.renderJob.update({
        where: { id: job.id },
        data: { status: JobStatus.COMPLETED }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown rendering error';
      return this.handleJobFailure(renderingJob, errorMessage);
    }
  }

  /**
   * Cancels a specific render job, aborting the process if it is currently rendering.
   *
   * @param jobId - The unique identifier of the job to cancel.
   * @returns A promise that resolves to the updated RenderJob marked as CANCELLED.
   */
  public async cancelJob(jobId: string): Promise<RenderJob> {
    await this.renderEngine.cancelProcess(jobId);
    
    return this.db.renderJob.update({
      where: { id: jobId },
      data: { status: JobStatus.CANCELLED }
    });
  }

  /**
   * Internal method to handle job failures and retry logic.
   * Re-queues the job if max retries haven't been met; otherwise marks it as FAILED.
   *
   * @param job - The job that failed.
   * @param errorMessage - The error message detailing the cause of failure.
   * @returns A promise that resolves to the updated RenderJob.
   */
  private async handleJobFailure(job: RenderJob, errorMessage: string): Promise<RenderJob> {
    if (job.attempts < this.maxRetries) {
      return this.db.renderJob.update({
        where: { id: job.id },
        data: { 
          status: JobStatus.QUEUED,
          error: errorMessage
        }
      });
    }

    return this.db.renderJob.update({
      where: { id: job.id },
      data: { 
        status: JobStatus.FAILED,
        error: errorMessage
      }
    });
  }
}

export const renderQueueService = new RenderQueueService(
  {} as DatabaseClient, 
  {} as RenderEngineClient
);

describe('RenderQueueService Integration Tests', () => {
  let mockDb: DatabaseClient;
  let mockRenderEngine: RenderEngineClient;
  let service: RenderQueueService;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDb = {
      renderJob: {
        create: vi.fn(),
        update: vi.fn(),
        findFirst: vi.fn(),
      }
    };

    mockRenderEngine = {
      startProcess: vi.fn(),
      cancelProcess: vi.fn(),
    };

    service = new RenderQueueService(mockDb, mockRenderEngine);
  });

  describe('Job Queuing and Priority Scheduling', () => {
    it('should successfully queue a new render job with default priority', async () => {
      const mockJob: RenderJob = { 
        id: 'job-1', 
        projectId: 'proj-1', 
        priority: 0, 
        status: JobStatus.QUEUED, 
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      vi.mocked(mockDb.renderJob.create).mockResolvedValueOnce(mockJob);

      const job = await service.queueJob('proj-1');

      expect(mockDb.renderJob.create).toHaveBeenCalledWith({
        data: {
          projectId: 'proj-1',
          priority: 0,
          status: JobStatus.QUEUED,
          attempts: 0
        }
      });
      expect(job.status).toBe(JobStatus.QUEUED);
      expect(job.priority).toBe(0);
    });

    it('should queue a job with high priority', async () => {
      const mockJob: RenderJob = { 
        id: 'job-2', 
        projectId: 'proj-2', 
        priority: 10, 
        status: JobStatus.QUEUED, 
        attempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      vi.mocked(mockDb.renderJob.create).mockResolvedValueOnce(mockJob);

      const job = await service.queueJob('proj-2', 10);

      expect(mockDb.renderJob.create).toHaveBeenCalledWith({
        data: {
          projectId: 'proj-2',
          priority: 10,
          status: JobStatus.QUEUED,
          attempts: 0
        }
      });
      expect(job.priority).toBe(10);
    });

    it('should throw an AppError if projectId is missing or empty', async () => {
      await expect(service.queueJob('')).rejects.toThrow(AppError);
      await expect(service.queueJob('   ')).rejects.toThrow(AppError);
    });
  });

  describe('State Transitions (Queued -> Rendering -> Completed)', () => {
    it('should transition job state successfully through the happy path', async () => {
      const queuedJob: RenderJob = { 
        id: 'job-1', projectId: 'proj-1', priority: 1, status: JobStatus.QUEUED, attempts: 0,
        createdAt: new Date(), updatedAt: new Date()
      };
      const renderingJob: RenderJob = { ...queuedJob, status: JobStatus.RENDERING, attempts: 1 };
      const completedJob: RenderJob = { ...renderingJob, status: JobStatus.COMPLETED };

      vi.mocked(mockDb.renderJob.findFirst).mockResolvedValueOnce(queuedJob);
      vi.mocked(mockDb.renderJob.update)
        .mockResolvedValueOnce(renderingJob) 
        .mockResolvedValueOnce(completedJob); 
        
      vi.mocked(mockRenderEngine.startProcess).mockResolvedValueOnce(undefined);

      const result = await service.processNext();

      expect(mockDb.renderJob.findFirst).toHaveBeenCalledWith({
        where: { status: JobStatus.QUEUED },
        orderBy: { priority: 'desc' }
      });
      
      expect(mockDb.renderJob.update).toHaveBeenNthCalledWith(1, {
        where: { id: queuedJob.id },
        data: { status: JobStatus.RENDERING, attempts: 1 }
      });
      
      expect(mockRenderEngine.startProcess).toHaveBeenCalledWith(queuedJob.id);
      
      expect(mockDb.renderJob.update).toHaveBeenNthCalledWith(2, {
        where: { id: queuedJob.id },
        data: { status: JobStatus.COMPLETED }
      });

      expect(result).toEqual(completedJob);
    });

    it('should return null if there are no queued jobs', async () => {
      vi.mocked(mockDb.renderJob.findFirst).mockResolvedValueOnce(null);

      const result = await service.processNext();

      expect(result).toBeNull();
      expect(mockDb.renderJob.update).not.toHaveBeenCalled();
      expect(mockRenderEngine.startProcess).not.toHaveBeenCalled();
    });
  });

  describe('Retry Logic', () => {
    it('should requeue job if rendering fails and max retries are not reached', async () => {
      const queuedJob: RenderJob = { 
        id: 'job-1', projectId: 'proj-1', priority: 1, status: JobStatus.QUEUED, attempts: 1,
        createdAt: new Date(), updatedAt: new Date()
      };
      const renderingJob: RenderJob = { ...queuedJob, status: JobStatus.RENDERING, attempts: 2 };
      const requeuedJob: RenderJob = { ...renderingJob, status: JobStatus.QUEUED, error: 'Render engine crashed' };

      vi.mocked(mockDb.renderJob.findFirst).mockResolvedValueOnce(queuedJob);
      vi.mocked(mockDb.renderJob.update)
        .mockResolvedValueOnce(renderingJob) 
        .mockResolvedValueOnce(requeuedJob); 
        
      vi.mocked(mockRenderEngine.startProcess).mockRejectedValueOnce(new Error('Render engine crashed'));

      const result = await service.processNext();

      expect(mockRenderEngine.startProcess).toHaveBeenCalledWith(queuedJob.id);
      expect(mockDb.renderJob.update).toHaveBeenLastCalledWith({
        where: { id: queuedJob.id },
        data: { status: JobStatus.QUEUED, error: 'Render engine crashed' }
      });
      expect(result?.status).toBe(JobStatus.QUEUED);
      expect(result?.attempts).toBe(2);
    });

    it('should fail job permanently if max retries are reached', async () => {
      const queuedJob: RenderJob = { 
        id: 'job-1', projectId: 'proj-1', priority: 1, status: JobStatus.QUEUED, attempts: 2,
        createdAt: new Date(), updatedAt: new Date()
      };
      const renderingJob: RenderJob = { ...queuedJob, status: JobStatus.RENDERING, attempts: 3 };
      const failedJob: RenderJob = { ...renderingJob, status: JobStatus.FAILED, error: 'Out of memory' };

      vi.mocked(mockDb.renderJob.findFirst).mockResolvedValueOnce(queuedJob);
      vi.mocked(mockDb.renderJob.update)
        .mockResolvedValueOnce(renderingJob) 
        .mockResolvedValueOnce(failedJob); 
        
      vi.mocked(mockRenderEngine.startProcess).mockRejectedValueOnce(new Error('Out of memory'));

      const result = await service.processNext();

      expect(mockDb.renderJob.update).toHaveBeenLastCalledWith({
        where: { id: queuedJob.id },
        data: { status: JobStatus.FAILED, error: 'Out of memory' }
      });
      expect(result?.status).toBe(JobStatus.FAILED);
      expect(result?.attempts).toBe(3);
    });
  });

  describe('Cancellation', () => {
    it('should cancel a job and invoke the render engine cancellation', async () => {
      const cancelledJob: RenderJob = { 
        id: 'job-1', projectId: 'proj-1', priority: 1, status: JobStatus.CANCELLED, attempts: 1,
        createdAt: new Date(), updatedAt: new Date()
      };
      
      vi.mocked(mockRenderEngine.cancelProcess).mockResolvedValueOnce(undefined);
      vi.mocked(mockDb.renderJob.update).mockResolvedValueOnce(cancelledJob);

      const result = await service.cancelJob('job-1');

      expect(mockRenderEngine.cancelProcess).toHaveBeenCalledWith('job-1');
      expect(mockDb.renderJob.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.CANCELLED }
      });
      expect(result.status).toBe(JobStatus.CANCELLED);
    });
  });
});
