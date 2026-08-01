import { Router } from 'express';
import { ProjectsController } from './projects.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', ProjectsController.createProject);
router.get('/', ProjectsController.getProjects);
router.get('/:projectId', ProjectsController.getProject);
router.patch('/:projectId', ProjectsController.updateProject);
router.delete('/:projectId', ProjectsController.deleteProject);

export default router;
