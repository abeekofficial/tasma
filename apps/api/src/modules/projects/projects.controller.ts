import { Request, Response, NextFunction } from 'express';
import { projectService } from './projects.service';
import { createProjectSchema, updateProjectSchema, listProjectsQuerySchema } from './projects.validators';

export class ProjectsController {
  public static async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = createProjectSchema.parse(req.body);
      const project = await projectService.createProject(userId, validatedData);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  public static async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const query = listProjectsQuerySchema.parse(req.query);
      
      const page = query.page || 1;
      const limit = query.limit || 20;
      
      const data = await projectService.getProjects(query.workspaceId, userId, page, limit, query.search);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const project = await projectService.getProject(req.params.projectId!, userId);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const validatedData = updateProjectSchema.parse(req.body);
      const project = await projectService.updateProject(req.params.projectId!, validatedData, userId);
      res.status(200).json({ success: true, data: project });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await projectService.deleteProject(req.params.projectId!, userId);
      res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
      next(error);
    }
  }
}
