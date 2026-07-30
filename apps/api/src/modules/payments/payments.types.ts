export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PADDLE = 'PADDLE',
  LEMONSQUEEZY = 'LEMONSQUEEZY',
  GOOGLE_PLAY = 'GOOGLE_PLAY',
  APPLE = 'APPLE'
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  provider: PaymentProvider;
  metadata?: Record<string, any>;
}

export interface CheckoutSession {
  id: string;
  url: string;
  provider: PaymentProvider;
  planId: string;
  customerId: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  provider: PaymentProvider;
  data: any;
  signature: string;
  timestamp: Date;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  url?: string;
  createdAt: Date;
}

export interface IPaymentGateway {
  createCheckoutSession(planId: string, customerId: string, options?: any): Promise<CheckoutSession>;
  createPortalSession(customerId: string): Promise<{ url: string }>;
  handleWebhook(payload: any, signature: string): Promise<WebhookEvent>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  resumeSubscription(subscriptionId: string): Promise<void>;
  updateSubscription(subscriptionId: string, newPlanId: string): Promise<void>;
  getInvoices(customerId: string, limit: number): Promise<Invoice[]>;
  refund(paymentId: string, amount?: number): Promise<void>;
}

export class PaymentGatewayFactory {
  private static gateways: Map<PaymentProvider, IPaymentGateway> = new Map();

  static register(provider: PaymentProvider, gateway: IPaymentGateway) {
    this.gateways.set(provider, gateway);
  }

  static getGateway(provider: PaymentProvider): IPaymentGateway {
    const gateway = this.gateways.get(provider);
    if (!gateway) {
      throw new Error(`Payment provider ${provider} not supported`);
    }
    return gateway;
  }
}
