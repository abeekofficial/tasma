import Stripe from 'stripe';
import env from '@/config/env';
import { IPaymentGateway, CheckoutSession, WebhookEvent, Invoice, PaymentProvider } from './payments.types';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';

const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16' as any // Use an appropriate API version
});

export class StripeGateway implements IPaymentGateway {
  async createCheckoutSession(planId: string, customerId: string, options?: any): Promise<CheckoutSession> {
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: planId, // Assuming planId matches Stripe Price ID
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.APP_URL}/billing/cancel`,
        metadata: options?.metadata || {},
      });

      if (!session.url) throw new Error('Failed to create session URL');

      return {
        id: session.id,
        url: session.url,
        provider: PaymentProvider.STRIPE,
        planId,
        customerId
      };
    } catch (error: any) {
      throw new AppError(`Stripe checkout error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async createPortalSession(customerId: string): Promise<{ url: string }> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${env.APP_URL}/settings/billing`,
      });
      return { url: session.url };
    } catch (error: any) {
      throw new AppError(`Stripe portal error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<WebhookEvent> {
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET as string
      );

      return {
        id: event.id,
        type: event.type,
        provider: PaymentProvider.STRIPE,
        data: event.data.object,
        signature,
        timestamp: new Date(event.created * 1000)
      };
    } catch (error: any) {
      throw new AppError(`Webhook error: ${error.message}`, ERROR_CODES.BAD_REQUEST, 400);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.cancel(subscriptionId);
    } catch (error: any) {
      throw new AppError(`Stripe cancel error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async resumeSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.resume(subscriptionId, {
        billing_cycle_anchor: 'now'
      });
    } catch (error: any) {
      throw new AppError(`Stripe resume error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async updateSubscription(subscriptionId: string, newPlanId: string): Promise<void> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPlanId,
        }],
      });
    } catch (error: any) {
      throw new AppError(`Stripe update error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async getInvoices(customerId: string, limit: number): Promise<Invoice[]> {
    try {
      const invoices = await stripe.invoices.list({
        customer: customerId,
        limit,
      });

      return invoices.data.map(inv => ({
        id: inv.id,
        amount: inv.amount_paid,
        currency: inv.currency,
        status: inv.status || 'unknown',
        url: inv.hosted_invoice_url || undefined,
        createdAt: new Date(inv.created * 1000)
      }));
    } catch (error: any) {
      throw new AppError(`Stripe get invoices error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }

  async refund(paymentId: string, amount?: number): Promise<void> {
    try {
      await stripe.refunds.create({
        payment_intent: paymentId,
        amount, // If not provided, refunds full amount
      });
    } catch (error: any) {
      throw new AppError(`Stripe refund error: ${error.message}`, ERROR_CODES.INTERNAL_SERVER_ERROR, 500);
    }
  }
}
