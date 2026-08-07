import { Request, Response, NextFunction } from 'express';
import { renderQueueService } from './render-queue.service';
import { queueManager } from './queue-manager';
import {
  createRenderJobSchema,
  updateRenderJobStatusSchema,
  listRenderJobsQuerySchema,
  retryRenderJobSchema,
  batchJobIdsSchema,
  batchRetrySchema,
  searchRenderJobsSchema,
  updatePrioritySchema,
  cleanupSchema,
  projectActionSchema,
  trendsQuerySchema,
  waitTimeQuerySchema,
} from './render-queue.validators';

export class RenderQueueController {
  // ──────────────────────────────────────────────
  // Foundation CRUD (Phase 9.4A)
  // ──────────────────────────────────────────────

  public static async createRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = createRenderJobSchema.parse(req.body);
      const job = await queueManager.createJob(userId, validatedData);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async getRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await queueManager.getJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async listRenderJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = listRenderJobsQuerySchema.parse(req.query);

      const page = query.page || 1;
      const limit = query.limit || 20;
      const sortBy = query.sortBy || 'createdAt';
      const sortOrder = query.sortOrder || 'desc';

      const data = await renderQueueService.listRenderJobs(
        userId,
        { projectId: query.projectId, status: query.status, type: query.type, priority: query.priority },
        page,
        limit,
        sortBy,
        sortOrder
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async updateJobStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = updateRenderJobStatusSchema.parse(req.body);
      const job = await queueManager.updateJobStatus(req.params.jobId!, userId, validatedData);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await renderQueueService.deleteRenderJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, message: 'Render job deleted' });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Single Job Actions
  // ──────────────────────────────────────────────

  public static async retryRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const options = retryRenderJobSchema.parse(req.body);
      const job = await queueManager.retryJob(req.params.jobId!, userId, {
        resetProgress: options.resetProgress ?? true,
        priority: options.priority,
      });
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async cancelRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await queueManager.cancelJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async pauseRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await queueManager.pauseJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async resumeRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await queueManager.resumeJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async updatePriority(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { priority } = updatePrioritySchema.parse(req.body);
      const job = await queueManager.updateJobPriority(req.params.jobId!, userId, priority);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Logs
  // ──────────────────────────────────────────────

  public static async getJobLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const logs = await renderQueueService.getJobLogs(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Batch Operations (Phase 9.4B)
  // ──────────────────────────────────────────────

  public static async batchCancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { jobIds, reason } = batchJobIdsSchema.parse(req.body);
      const result = await queueManager.batchCancel(jobIds, userId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async batchRetry(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { jobIds, resetProgress, priority } = batchRetrySchema.parse(req.body);
      const result = await queueManager.batchRetry(jobIds, userId, {
        resetProgress: resetProgress ?? true,
        priority,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async batchPause(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { jobIds, reason } = batchJobIdsSchema.parse(req.body);
      const result = await queueManager.batchPause(jobIds, userId, reason);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async batchResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { jobIds } = batchJobIdsSchema.parse(req.body);
      const result = await queueManager.batchResume(jobIds, userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Project-wide Actions
  // ──────────────────────────────────────────────

  public static async cancelAllForProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { projectId, reason } = projectActionSchema.parse(req.body);
      const count = await queueManager.cancelAllForProject(projectId, userId, reason);
      res.status(200).json({ success: true, data: { cancelledCount: count } });
    } catch (error) {
      next(error);
    }
  }

  public static async pauseAllForProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { projectId, reason } = projectActionSchema.parse(req.body);
      const { queuePauseResumeService } = await import('./queue-pause-resume.service');
      const count = await queuePauseResumeService.pauseAllForProject(projectId, userId, reason);
      res.status(200).json({ success: true, data: { pausedCount: count } });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Search
  // ──────────────────────────────────────────────

  public static async searchJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = searchRenderJobsSchema.parse(req.query);

      const data = await queueManager.searchJobs(
        {
          userId,
          search: query.search,
          projectId: query.projectId,
          status: query.status,
          type: query.type,
          priority: query.priority,
          dateFrom: query.dateFrom ? new Date(query.dateFrom) : undefined,
          dateTo: query.dateTo ? new Date(query.dateTo) : undefined,
        },
        query.page || 1,
        query.limit || 20,
        query.sortBy || 'createdAt',
        query.sortOrder || 'desc'
      );
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Statistics & Health
  // ──────────────────────────────────────────────

  public static async getQueueStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const stats = await renderQueueService.getQueueStats(userId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  public static async getQueueOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const overview = await queueManager.getQueueOverview(userId);
      res.status(200).json({ success: true, data: overview });
    } catch (error) {
      next(error);
    }
  }

  public static async getQueueTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = trendsQuerySchema.parse(req.query);
      const trends = await queueManager.getQueueTrends(userId, query.days || 30);
      res.status(200).json({ success: true, data: trends });
    } catch (error) {
      next(error);
    }
  }

  public static async getWaitTimeEstimate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = waitTimeQuerySchema.parse(req.query);
      const estimatedSeconds = await queueManager.estimateWaitTime(userId, query.priority);
      res.status(200).json({ success: true, data: { estimatedSeconds } });
    } catch (error) {
      next(error);
    }
  }

  public static async healthCheck(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const health = await queueManager.healthCheck(userId);
      res.status(health.healthy ? 200 : 503).json({ success: true, data: health });
    } catch (error) {
      next(error);
    }
  }

  // ──────────────────────────────────────────────
  // Cleanup
  // ──────────────────────────────────────────────

  public static async cleanupJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const options = cleanupSchema.parse(req.body);
      const result = await queueManager.cleanupCompletedJobs(userId, options);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public static async getCleanupPreview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;
      const preview = await queueManager.getCleanupPreview(userId, days);
      res.status(200).json({ success: true, data: preview });
    } catch (error) {
      next(error);
    }
  }

  public static async timeoutStaleJobs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const timeoutMinutes = req.body.timeoutMinutes || 60;
      const count = await queueManager.timeoutStaleJobs(userId, timeoutMinutes);
      res.status(200).json({ success: true, data: { timedOutCount: count } });
    } catch (error) {
      next(error);
    }
  }

  public static async autoRetryFailed(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const count = await queueManager.autoRetryFailedJobs(userId);
      res.status(200).json({ success: true, data: { retriedCount: count } });
    } catch (error) {
      next(error);
    }
  }
}
