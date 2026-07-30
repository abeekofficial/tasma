import { Router } from 'express';
import { ApiKeysController } from './api-keys.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, ApiKeysController.create);
router.get('/', requireAuth, ApiKeysController.list);
router.delete('/:keyId', requireAuth, ApiKeysController.revoke);
router.post('/:keyId/rotate', requireAuth, ApiKeysController.rotate);

export { router as apiKeysRoutes };
