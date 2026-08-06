import { Router } from 'express';
import { RenderQueueController } from './render-queue.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

// Queue Stats
router.get('/stats', RenderQueueController.getQueueStats);

// CRUD
router.post('/', RenderQueueController.createRenderJob);
router.get('/', RenderQueueController.listRenderJobs);
router.get('/:jobId', RenderQueueController.getRenderJob);
router.patch('/:jobId/status', RenderQueueController.updateJobStatus);
router.delete('/:jobId', RenderQueueController.deleteRenderJob);

// Job Actions
router.post('/:jobId/retry', RenderQueueController.retryRenderJob);
router.post('/:jobId/cancel', RenderQueueController.cancelRenderJob);
router.post('/:jobId/pause', RenderQueueController.pauseRenderJob);
router.post('/:jobId/resume', RenderQueueController.resumeRenderJob);

// Logs
router.get('/:jobId/logs', RenderQueueController.getJobLogs);

export default router;
