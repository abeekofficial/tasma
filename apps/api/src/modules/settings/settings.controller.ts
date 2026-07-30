import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { ApiResponse } from '@/shared/utils/response';
import { updateAccountSchema, updateNotificationSchema, deleteAccountSchema } from './settings.validators';

const settingsService = new SettingsService();

export class SettingsController {
  async getAccountSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await settingsService.getAccountSettings(userId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async updateAccountSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const parsedData = updateAccountSchema.parse(req.body);
      const data = await settingsService.updateAccountSettings(userId, parsedData);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getNotificationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await settingsService.getNotificationSettings(userId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async updateNotificationSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const parsedData = updateNotificationSchema.parse(req.body);
      const data = await settingsService.updateNotificationSettings(userId, parsedData);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getSecuritySettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await settingsService.getSecuritySettings(userId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getConnectedAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await settingsService.getConnectedAccounts(userId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async disconnectAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { providerId } = req.params;
      await settingsService.disconnectAccount(userId, providerId);
      return ApiResponse.success(res, { message: 'Account disconnected successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getSessionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await settingsService.getSessionHistory(userId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getExportHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { items, total } = await settingsService.getExportHistory(userId, page, limit);
      const totalPages = Math.ceil(total / limit);
      return ApiResponse.paginated(res, items, { page, limit, total, totalPages });
    } catch (error) {
      next(error);
    }
  }

  async getBillingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data = await settingsService.getBillingInfo(userId);
      return ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.error(res, new Error("Not implemented here. Use BetterAuth endpoints"));
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const parsedData = deleteAccountSchema.parse(req.body);
      await settingsService.deleteAccount(userId, parsedData.password);
      return ApiResponse.success(res, { message: 'Account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
