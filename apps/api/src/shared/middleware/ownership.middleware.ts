import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';

export type ResourceFetcher = (req: Request) => Promise<{ ownerId: string } | null>;

/**
 * Express middleware to enforce resource ownership
 * @param fetcher Async function to fetch the resource being accessed
 */
export const requireOwnership = (fetcher: ResourceFetcher) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw AppError.unauthorized('Authentication required');
      }

      const resource = await fetcher(req);

      if (!resource) {
        throw AppError.notFound('Resource not found');
      }

      if (req.user.role === 'SUPER_ADMIN') {
        (req as any).resource = resource;
        return next();
      }

      if (resource.ownerId !== req.user.id) {
        throw AppError.forbidden('You do not have ownership of this resource');
      }

      (req as any).resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};
