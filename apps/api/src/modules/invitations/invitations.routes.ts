import { Router } from 'express';
import { InvitationsController } from './invitations.controller';
import { requireAuth } from '@/shared/middleware/auth.middleware';
import { requireOrgRole } from '@/shared/middleware/rbac.middleware';

const router = Router({ mergeParams: true }); // Important if mounted under /organizations/:orgId

router.post('/', requireAuth, requireOrgRole('orgId', ['ADMIN', 'OWNER']), InvitationsController.create);
router.get('/', requireAuth, requireOrgRole('orgId', ['ADMIN', 'OWNER']), InvitationsController.list);

// These would be mounted directly under /invitations in parent router:
router.post('/:token/accept', requireAuth, InvitationsController.accept);
router.post('/:inviteId/revoke', requireAuth, InvitationsController.revoke); // Note: Should probably check org role but inviteId implies finding org first.
router.post('/:inviteId/resend', requireAuth, InvitationsController.resend);

export { router as invitationsRoutes };
