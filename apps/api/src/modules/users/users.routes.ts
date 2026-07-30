import { Router } from 'express';
import { UsersController } from './users.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';
import { requirePermission } from '@/shared/middleware/permission.middleware';

const router = Router();

router.get('/', requireAuth, requirePermission('user.list'), UsersController.listUsers);
router.get('/:userId', requireAuth, requirePermission('user.read'), UsersController.getUser);
router.patch('/:userId', requireAuth, requirePermission('user.manage'), UsersController.updateUser);
router.patch('/:userId/profile', requireAuth, UsersController.updateProfile);
router.post('/:userId/suspend', requireAuth, requirePermission('system.manage_users'), UsersController.suspendUser);
router.post('/:userId/ban', requireAuth, requirePermission('system.manage_users'), UsersController.banUser);
router.post('/:userId/restore', requireAuth, requirePermission('system.manage_users'), UsersController.restoreUser);
router.delete('/:userId', requireAuth, requirePermission('system.manage_users'), UsersController.deleteUser);

export { router as usersRoutes };
