import { Router } from 'express';
import { OrganizationsController } from './organizations.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';
import { requireOrgRole } from '@/shared/middleware/rbac.middleware';

const router = Router();

router.post('/', requireAuth, OrganizationsController.createOrg);
router.get('/', requireAuth, OrganizationsController.getUserOrgs);
router.get('/:orgId', requireAuth, requireOrgRole('orgId', ['VIEWER','MEMBER','BILLING','ADMIN','OWNER']), OrganizationsController.getOrg);
router.patch('/:orgId', requireAuth, requireOrgRole('orgId', ['ADMIN', 'OWNER']), OrganizationsController.updateOrg);
router.delete('/:orgId', requireAuth, requireOrgRole('orgId', ['OWNER']), OrganizationsController.deleteOrg);
router.get('/:orgId/members', requireAuth, requireOrgRole('orgId', ['MEMBER','ADMIN','OWNER']), OrganizationsController.getMembers);
router.patch('/:orgId/members/:memberId/role', requireAuth, requireOrgRole('orgId', ['ADMIN', 'OWNER']), OrganizationsController.updateMemberRole);
router.delete('/:orgId/members/:memberId', requireAuth, requireOrgRole('orgId', ['ADMIN', 'OWNER']), OrganizationsController.removeMember);
router.post('/:orgId/transfer-ownership', requireAuth, requireOrgRole('orgId', ['OWNER']), OrganizationsController.transferOwnership);

export { router as organizationsRoutes };
