import { Request, Response, NextFunction } from 'express';
import { organizationService } from './organizations.service';

export class OrganizationsController {
  public static async createOrg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const org = await organizationService.createOrganization(userId, req.body);
      res.status(201).json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  public static async getUserOrgs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const orgs = await organizationService.getOrganizationsForUser(userId);
      res.status(200).json({ success: true, data: orgs });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const org = await organizationService.getOrganization(req.params.orgId!, userId);
      res.status(200).json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  public static async updateOrg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      const org = await organizationService.updateOrganization(req.params.orgId!, req.body, actorId);
      res.status(200).json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteOrg(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await organizationService.deleteOrganization(req.params.orgId!, actorId);
      res.status(200).json({ success: true, message: 'Organization deleted' });
    } catch (error) {
      next(error);
    }
  }

  public static async getMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const data = await organizationService.getMembers(req.params.orgId!, page, limit);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  public static async updateMemberRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      const { role } = req.body;
      const updated = await organizationService.updateMemberRole(req.params.orgId!, req.params.memberId!, role, actorId);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  public static async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      await organizationService.removeMember(req.params.orgId!, req.params.memberId!, actorId);
      res.status(200).json({ success: true, message: 'Member removed' });
    } catch (error) {
      next(error);
    }
  }

  public static async transferOwnership(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const actorId = (req as any).user.id;
      const { newOwnerId } = req.body;
      await organizationService.transferOwnership(req.params.orgId!, newOwnerId, actorId);
      res.status(200).json({ success: true, message: 'Ownership transferred' });
    } catch (error) {
      next(error);
    }
  }
}
