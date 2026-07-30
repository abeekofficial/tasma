import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {
  /**
   * Gets the currently authenticated user's details.
   */
  public static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const user = await authService.getCurrentUser(userId);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Gets all active sessions for the current user.
   */
  public static async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const currentSessionId = (req as any).session?.id;
      const sessions = await authService.getActiveSessions(userId, currentSessionId);
      res.status(200).json({ success: true, data: sessions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revokes a specific session.
   */
  public static async revokeSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { sessionId } = req.params;
      await authService.revokeSession(userId, sessionId!);
      res.status(200).json({ success: true, message: 'Session revoked successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Revokes all active sessions except the current one.
   */
  public static async revokeAllSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const currentSessionId = (req as any).session?.id;
      const data = await authService.revokeAllSessions(userId, currentSessionId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivates the current user's account.
   */
  public static async deactivateAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await authService.deactivateAccount(userId);
      res.status(200).json({ success: true, message: 'Account deactivated successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the audit log for the current user.
   */
  public static async getAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const log = await authService.getAuditLog(userId, page, limit);
      res.status(200).json({ success: true, data: log });
    } catch (error) {
      next(error);
    }
  }
}
