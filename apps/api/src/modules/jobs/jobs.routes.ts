import { Router } from 'express';
import { jobsController } from './jobs.controller';

const router = Router();

router.get('/:queueName/:jobId', jobsController.getJobStatus);
router.post('/:queueName/:jobId/cancel', jobsController.cancelJob);

export default router;
