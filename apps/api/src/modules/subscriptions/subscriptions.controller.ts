import { Request, Response, NextFunction } from 'express';
import { SubscriptionsService } from './subscriptions.service';
import { ApiResponse } from '@/shared/utils/response';

const subscriptionsService = new SubscriptionsService();

export class SubscriptionsController {
  async listPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await subscriptionsService.getPlans();
      return ApiResponse.success(res, plans);
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await subscriptionsService.getPlanById(req.params.planId);
      return ApiResponse.success(res, plan);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      // Ideally get orgId from query/headers if needed
      const sub = await subscriptionsService.getSubscription(userId);
      return ApiResponse.success(res, sub);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const usage = await subscriptionsService.getCurrentUsage(userId);
      return ApiResponse.success(res, usage);
    } catch (error) {
      next(error);
    }
  }

  async checkLimit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { limitKey } = req.body;
      const result = await subscriptionsService.checkLimit(userId, undefined, limitKey);
      return ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
