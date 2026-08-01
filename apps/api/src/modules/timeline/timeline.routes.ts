import { Router } from 'express';
import { TimelineController } from './timeline.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/:projectId', TimelineController.getTimeline);
router.post('/:projectId', TimelineController.createTimeline);
router.patch('/:projectId', TimelineController.updateTimeline);
router.post('/:projectId/sync', TimelineController.syncTimeline);

export default router;
