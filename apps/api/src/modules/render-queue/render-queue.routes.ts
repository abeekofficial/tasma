import { Router } from 'express';
import { RenderQueueController } from './render-queue.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

// ──────────────────────────────────────────────
// Queue-level endpoints
// ──────────────────────────────────────────────

router.get('/stats', RenderQueueController.getQueueStats);
router.get('/overview', RenderQueueController.getQueueOverview);
router.get('/trends', RenderQueueController.getQueueTrends);
router.get('/health', RenderQueueController.healthCheck);
router.get('/wait-time', RenderQueueController.getWaitTimeEstimate);
router.get('/search', RenderQueueController.searchJobs);

// ──────────────────────────────────────────────
// Cleanup & Maintenance
// ──────────────────────────────────────────────

router.get('/cleanup/preview', RenderQueueController.getCleanupPreview);
router.post('/cleanup', RenderQueueController.cleanupJobs);
router.post('/cleanup/timeout', RenderQueueController.timeoutStaleJobs);
router.post('/auto-retry', RenderQueueController.autoRetryFailed);

// ──────────────────────────────────────────────
// Batch Operations
// ──────────────────────────────────────────────

router.post('/batch/cancel', RenderQueueController.batchCancel);
router.post('/batch/retry', RenderQueueController.batchRetry);
router.post('/batch/pause', RenderQueueController.batchPause);
router.post('/batch/resume', RenderQueueController.batchResume);

// ──────────────────────────────────────────────
// Project-wide Actions
// ──────────────────────────────────────────────

router.post('/project/cancel', RenderQueueController.cancelAllForProject);
router.post('/project/pause', RenderQueueController.pauseAllForProject);

// ──────────────────────────────────────────────
// CRUD
// ──────────────────────────────────────────────

router.post('/', RenderQueueController.createRenderJob);
router.get('/', RenderQueueController.listRenderJobs);
router.get('/:jobId', RenderQueueController.getRenderJob);
router.patch('/:jobId/status', RenderQueueController.updateJobStatus);
router.patch('/:jobId/priority', RenderQueueController.updatePriority);
router.delete('/:jobId', RenderQueueController.deleteRenderJob);

// ──────────────────────────────────────────────
// Single Job Actions
// ──────────────────────────────────────────────

router.post('/:jobId/retry', RenderQueueController.retryRenderJob);
router.post('/:jobId/cancel', RenderQueueController.cancelRenderJob);
router.post('/:jobId/pause', RenderQueueController.pauseRenderJob);
router.post('/:jobId/resume', RenderQueueController.resumeRenderJob);

// ──────────────────────────────────────────────
// Logs
// ──────────────────────────────────────────────

router.get('/:jobId/logs', RenderQueueController.getJobLogs);

export default router;
