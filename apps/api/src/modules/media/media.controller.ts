import { Request, Response, NextFunction } from 'express';
import { mediaService } from './media.service';
import { getMediaUploadUrlSchema, updateMediaSchema, listMediaQuerySchema } from './media.validators';

export class MediaController {
  public static async getUploadUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = getMediaUploadUrlSchema.parse(req.body);
      const data = await mediaService.getUploadUrl(userId, validatedData);
      res.status(201).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async listMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = listMediaQuerySchema.parse(req.query);
      
      const page = query.page || 1;
      const limit = query.limit || 20;
      
      const data = await mediaService.listMedia(query.workspaceId, userId, page, limit, {
        search: query.search,
        type: query.type
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async getMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const media = await mediaService.getMedia(req.params.mediaId!, userId);
      res.status(200).json({ success: true, data: media });
    } catch (error) {
      next(error);
    }
  }

  public static async updateMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = updateMediaSchema.parse(req.body);
      const media = await mediaService.updateMedia(req.params.mediaId!, validatedData, userId);
      res.status(200).json({ success: true, data: media });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await mediaService.deleteMedia(req.params.mediaId!, userId);
      res.status(200).json({ success: true, message: 'Media deleted' });
    } catch (error) {
      next(error);
    }
  }
}
