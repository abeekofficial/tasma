import { Request, Response, NextFunction } from 'express';
import { userService } from './users.service';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';

export class UsersController {
  public static async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUser(req.params.userId!);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  public static async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, role, status } = req.query as { search?: string; role?: string; status?: string };
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const users = await userService.listUsers({ search, role, status, page, limit });
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      const user = await userService.updateUser(req.params.userId!, req.body, actorId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const targetUserId = req.params.userId!;
      const actorId = (req as any).user.id;
      const role = (req as any).user.role;

      if (targetUserId !== actorId && role !== 'ADMIN') {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'Not allowed to update this profile');
      }

      const profile = await userService.updateProfile(targetUserId, req.body);
      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  }

  public static async suspendUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await userService.suspendUser(req.params.userId!, actorId);
      res.status(200).json({ success: true, message: 'User suspended' });
    } catch (error) {
      next(error);
    }
  }

  public static async banUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await userService.banUser(req.params.userId!, actorId);
      res.status(200).json({ success: true, message: 'User banned' });
    } catch (error) {
      next(error);
    }
  }

  public static async restoreUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await userService.restoreUser(req.params.userId!, actorId);
      res.status(200).json({ success: true, message: 'User restored' });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await userService.deleteUser(req.params.userId!, actorId);
      res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
      next(error);
    }
  }
}
