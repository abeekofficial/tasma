import { Request, Response, NextFunction } from 'express';
import { templateService } from './templates.service';
import { createTemplateSchema, updateTemplateSchema, listTemplatesQuerySchema } from './templates.validators';

export class TemplatesController {
  public static async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = createTemplateSchema.parse(req.body);
      const template = await templateService.createTemplate(userId, validatedData);
      res.status(201).json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  }

  public static async listTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = listTemplatesQuerySchema.parse(req.query);
      
      const page = query.page || 1;
      const limit = query.limit || 20;
      
      const data = await templateService.listTemplates(userId, {
        organizationId: query.organizationId,
        category: query.category,
        search: query.search,
        isPublic: query.isPublic
      }, page, limit);
      
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async getTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const template = await templateService.getTemplate(req.params.templateId!, userId);
      res.status(200).json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  }

  public static async updateTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = updateTemplateSchema.parse(req.body);
      const template = await templateService.updateTemplate(req.params.templateId!, validatedData, userId);
      res.status(200).json({ success: true, data: template });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await templateService.deleteTemplate(req.params.templateId!, userId);
      res.status(200).json({ success: true, message: 'Template deleted' });
    } catch (error) {
      next(error);
    }
  }
}
