import { Request, Response, NextFunction } from 'express';
import { timelineService } from './timeline.service';
import { createTimelineSchema, updateTimelineSchema, syncTimelineSchema } from './timeline.validators';

export class TimelineController {
  public static async getTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const timeline = await timelineService.getTimeline(req.params.projectId!, userId);
      res.status(200).json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  }

  public static async createTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = createTimelineSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
      });
      const timeline = await timelineService.createTimeline(userId, validatedData);
      res.status(201).json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  }

  public static async updateTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = updateTimelineSchema.parse(req.body);
      const timeline = await timelineService.updateTimeline(req.params.projectId!, validatedData, userId);
      res.status(200).json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  }

  public static async syncTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = syncTimelineSchema.parse(req.body);
      const timeline = await timelineService.syncTimeline(req.params.projectId!, validatedData, userId);
      res.status(200).json({ success: true, data: timeline });
    } catch (error) {
      next(error);
    }
  }
}
