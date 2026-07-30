import { PaymentProvider, PaymentGatewayFactory, WebhookEvent } from './payments.types';
import { StripeGateway } from './stripe.gateway';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { prisma } from '@/lib/prisma';

// Register gateways
PaymentGatewayFactory.register(PaymentProvider.STRIPE, new StripeGateway());

export class PaymentsService {
  async createCheckout(userId: string, orgId: string | undefined, planId: string, provider: PaymentProvider) {
    const gateway = PaymentGatewayFactory.getGateway(provider);

    // Get customer ID logic (simplified here)
    const customerId = `cus_${userId}`;

    const session = await gateway.createCheckoutSession(planId, customerId, {
      metadata: { userId, orgId }
    });

    return session;
  }

  async handleWebhook(provider: PaymentProvider, payload: any, signature: string) {
    const gateway = PaymentGatewayFactory.getGateway(provider);
    const event = await gateway.handleWebhook(payload, signature);

    // Process event based on type
    switch (event.type) {
      case 'customer.subscription.created':
        // logic
        break;
      case 'customer.subscription.updated':
        // logic
        break;
      case 'customer.subscription.deleted':
        // logic
        break;
      case 'invoice.paid':
        // logic
        break;
      case 'invoice.payment_failed':
        // logic
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  async cancelSubscription(userId: string, orgId?: string) {
    const provider = PaymentProvider.STRIPE; // hardcoded for example
    const gateway = PaymentGatewayFactory.getGateway(provider);
    const subscriptionId = `sub_${userId}`; // simplified
    await gateway.cancelSubscription(subscriptionId);
  }

  async getInvoices(userId: string, orgId?: string, page: number = 1, limit: number = 10) {
    const provider = PaymentProvider.STRIPE; // hardcoded for example
    const gateway = PaymentGatewayFactory.getGateway(provider);
    const customerId = `cus_${userId}`; // simplified
    const invoices = await gateway.getInvoices(customerId, limit);
    return invoices;
  }

  async getBillingPortal(userId: string, orgId?: string) {
    const provider = PaymentProvider.STRIPE; // hardcoded for example
    const gateway = PaymentGatewayFactory.getGateway(provider);
    const customerId = `cus_${userId}`; // simplified
    const session = await gateway.createPortalSession(customerId);
    return session;
  }
}
