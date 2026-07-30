import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();
const controller = new SettingsController();

router.use(requireAuth);

router.get('/account', controller.getAccountSettings);
router.patch('/account', controller.updateAccountSettings);

router.get('/notifications', controller.getNotificationSettings);
router.patch('/notifications', controller.updateNotificationSettings);

router.get('/security', controller.getSecuritySettings);

router.get('/connected-accounts', controller.getConnectedAccounts);
router.delete('/connected-accounts/:providerId', controller.disconnectAccount);

router.get('/sessions', controller.getSessionHistory);
router.get('/export-history', controller.getExportHistory);
router.get('/billing', controller.getBillingInfo);

router.post('/change-password', controller.changePassword);
router.post('/delete-account', controller.deleteAccount);

export default router;
