import { Request, Response, NextFunction } from 'express';
import { invitationsService } from './invitations.service';

export class InvitationsController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inviterId = (req as any).user.id;
      const { email, role } = req.body;
      const invite = await invitationsService.createInvitation(req.params.orgId!, email, role, inviterId);
      res.status(201).json({ success: true, data: invite });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const data = await invitationsService.listInvitations(req.params.orgId!, page, limit);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      await invitationsService.acceptInvitation(req.params.token!, userId);
      res.status(200).json({ success: true, message: 'Invitation accepted' });
    } catch (error) {
      next(error);
    }
  }

  public static async revoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await invitationsService.revokeInvitation(req.params.inviteId!, actorId);
      res.status(200).json({ success: true, message: 'Invitation revoked' });
    } catch (error) {
      next(error);
    }
  }

  public static async resend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await invitationsService.resendInvitation(req.params.inviteId!, actorId);
      res.status(200).json({ success: true, message: 'Invitation resent' });
    } catch (error) {
      next(error);
    }
  }
}
