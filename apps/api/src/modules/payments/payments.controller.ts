import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './payments.service';
import { PaymentProvider } from './payments.types';
import { ApiResponse } from '@/shared/utils/response';

const paymentsService = new PaymentsService();

export class PaymentsController {
  async createCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { planId, provider = PaymentProvider.STRIPE, orgId } = req.body;
      const session = await paymentsService.createCheckout(userId, orgId, planId, provider);
      return ApiResponse.success(res, session);
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const providerStr = req.params.provider.toUpperCase();
      const provider = providerStr as PaymentProvider;
      
      const signature = req.headers['stripe-signature'] as string; // Simplification for stripe
      const payload = req.body; // Needs to be raw buffer for stripe

      await paymentsService.handleWebhook(provider, payload, signature);
      return res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  }

  async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { orgId } = req.body;
      await paymentsService.cancelSubscription(userId, orgId);
      return ApiResponse.success(res, { message: 'Subscription canceled successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getInvoices(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { orgId, page, limit } = req.query;
      const invoices = await paymentsService.getInvoices(userId, orgId as string, parseInt(page as string) || 1, parseInt(limit as string) || 10);
      return ApiResponse.success(res, invoices);
    } catch (error) {
      next(error);
    }
  }

  async getBillingPortal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { orgId } = req.body;
      const session = await paymentsService.getBillingPortal(userId, orgId);
      return ApiResponse.success(res, session);
    } catch (error) {
      next(error);
    }
  }
}
