import { Request, Response, NextFunction } from 'express';
import { apiKeyService } from './api-keys.service';

export class ApiKeysController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { name, permissions, expiresAt, orgId } = req.body;
      const key = await apiKeyService.createApiKey(userId, orgId, name, permissions, expiresAt ? new Date(expiresAt) : undefined);
      res.status(201).json({ success: true, data: key });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const { orgId } = req.query;
      const keys = await apiKeyService.listApiKeys(userId, orgId as string);
      res.status(200).json({ success: true, data: keys });
    } catch (error) {
      next(error);
    }
  }

  public static async revoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await apiKeyService.revokeApiKey(req.params.keyId!, userId);
      res.status(200).json({ success: true, message: 'API key revoked' });
    } catch (error) {
      next(error);
    }
  }

  public static async rotate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const key = await apiKeyService.rotateApiKey(req.params.keyId!, userId);
      res.status(200).json({ success: true, data: key });
    } catch (error) {
      next(error);
    }
  }
}
