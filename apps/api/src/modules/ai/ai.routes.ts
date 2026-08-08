import { Router } from 'express';
import { AIController } from './ai.controller';

const router = Router();
const aiController = new AIController();

router.post('/generate-script', aiController.generateScript);
router.post('/generate-voice', aiController.generateVoice);
router.post('/generate-plan', aiController.generatePlan);
router.post('/translate-subtitles', aiController.translateSubtitles);

export { router as aiRoutes };
