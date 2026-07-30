import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { prisma } from '@/lib/prisma';
import redis from '@/lib/redis';
import { PlanLimits, SubscriptionInfo } from './subscriptions.types';

export class SubscriptionsService {
  async getSubscription(userId: string, orgId?: string): Promise<SubscriptionInfo> {
    const sub = await prisma.subscription.findFirst({
      where: orgId ? { organizationId: orgId } : { userId },
      include: { plan: true }
    });

    if (!sub) {
      throw new AppError('Subscription not found', ERROR_CODES.NOT_FOUND, 404);
    }

    const usage = await this.getCurrentUsage(userId, orgId);

    return {
      plan: sub.plan,
      status: sub.status,
      currentPeriodStart: sub.currentPeriodStart,
      currentPeriodEnd: sub.currentPeriodEnd,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
      trialEnd: sub.trialEnd,
      usage
    };
  }

  async getPlans() {
    return prisma.plan.findMany({ where: { isActive: true } });
  }

  async getPlanById(planId: string) {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new AppError('Plan not found', ERROR_CODES.NOT_FOUND, 404);
    return plan;
  }

  async checkLimit(userId: string, orgId: string | undefined, limitKey: keyof PlanLimits) {
    const sub = await this.getSubscription(userId, orgId);
    const limit = sub.plan.features[limitKey as string] ?? 0;
    const current = (sub.usage as any)[limitKey] ?? 0;

    return {
      allowed: current < limit,
      current,
      limit,
      remaining: Math.max(0, limit - current)
    };
  }

  async incrementUsage(userId: string, orgId: string | undefined, usageKey: string, amount: number) {
    // In a real implementation this would likely update redis and/or a usage table.
    // Simplifying here to avoid creating new schemas if missing
    return true;
  }

  async resetMonthlyQuotas() {
    // Reset quotas via chron job.
    return true;
  }

  async getCurrentUsage(userId: string, orgId?: string) {
    // Stub: fetch actual usage
    return {
      projects: 0,
      storage: '0',
      renders: 0,
      aiCredits: 0,
      exports: 0
    };
  }

  async canUpgrade(currentPlan: any, targetPlan: any) {
    // Simplified
    return true;
  }

  async canDowngrade(currentPlan: any, targetPlan: any, currentUsage: any) {
    // Simplified
    return true;
  }
}
