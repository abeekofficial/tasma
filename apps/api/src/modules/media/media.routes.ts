import { Router } from 'express';
import { MediaController } from './media.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/upload-url', MediaController.getUploadUrl);
router.get('/', MediaController.listMedia);
router.get('/:mediaId', MediaController.getMedia);
router.patch('/:mediaId', MediaController.updateMedia);
router.delete('/:mediaId', MediaController.deleteMedia);

export default router;
