import { Router } from 'express';
import { AuthController } from './auth.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, AuthController.getMe);
router.get('/sessions', requireAuth, AuthController.getSessions);
router.delete('/sessions/:sessionId', requireAuth, AuthController.revokeSession);
router.delete('/sessions', requireAuth, AuthController.revokeAllSessions);
router.post('/deactivate', requireAuth, AuthController.deactivateAccount);
router.get('/audit-log', requireAuth, AuthController.getAuditLog);

export { router as authRoutes };
