import { Router } from 'express';
import { SubscriptionsController } from './subscriptions.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new SubscriptionsController();

router.get('/plans', controller.listPlans);
router.get('/plans/:planId', controller.getPlanById);

router.get('/current', requireAuth, controller.getCurrentSubscription);
router.get('/usage', requireAuth, controller.getCurrentUsage);
router.post('/check-limit', requireAuth, controller.checkLimit);

export default router;
