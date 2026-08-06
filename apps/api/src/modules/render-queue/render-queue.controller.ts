import { Request, Response, NextFunction } from 'express';
import { renderQueueService } from './render-queue.service';
import {
  createRenderJobSchema,
  updateRenderJobStatusSchema,
  listRenderJobsQuerySchema,
  retryRenderJobSchema,
} from './render-queue.validators';

export class RenderQueueController {
  public static async createRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = createRenderJobSchema.parse(req.body);
      const job = await renderQueueService.createRenderJob(userId, validatedData);
      res.status(201).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async getRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await renderQueueService.getRenderJob(req.params.jobId!, userId);
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
      const job = await renderQueueService.updateJobStatus(req.params.jobId!, userId, validatedData);
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

  public static async retryRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const options = retryRenderJobSchema.parse(req.body);
      const job = await renderQueueService.retryRenderJob(req.params.jobId!, userId, options);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async cancelRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await renderQueueService.cancelRenderJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async pauseRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await renderQueueService.pauseRenderJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async resumeRenderJob(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const job = await renderQueueService.resumeRenderJob(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: job });
    } catch (error) {
      next(error);
    }
  }

  public static async getJobLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const logs = await renderQueueService.getJobLogs(req.params.jobId!, userId);
      res.status(200).json({ success: true, data: logs });
    } catch (error) {
      next(error);
    }
  }

  public static async getQueueStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const stats = await renderQueueService.getQueueStats(userId);
      res.status(200).json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }
}
