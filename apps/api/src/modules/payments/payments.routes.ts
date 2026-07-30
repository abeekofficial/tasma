import { Router, raw } from 'express';
import { PaymentsController } from './payments.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new PaymentsController();

router.post('/checkout', requireAuth, controller.createCheckout);
// Webhooks need raw body
router.post('/webhooks/:provider', raw({ type: 'application/json' }), controller.handleWebhook);
router.post('/cancel', requireAuth, controller.cancelSubscription);
router.get('/invoices', requireAuth, controller.getInvoices);
router.post('/portal', requireAuth, controller.getBillingPortal);

export default router;
