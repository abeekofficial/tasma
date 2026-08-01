import { Router } from 'express';
import { TemplatesController } from './templates.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', TemplatesController.createTemplate);
router.get('/', TemplatesController.listTemplates);
router.get('/:templateId', TemplatesController.getTemplate);
router.patch('/:templateId', TemplatesController.updateTemplate);
router.delete('/:templateId', TemplatesController.deleteTemplate);

export default router;
