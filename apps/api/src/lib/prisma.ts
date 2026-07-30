import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prismaOptions: any = {};
if (env.NODE_ENV === 'development') {
  prismaOptions.log = ['query', 'error', 'warn'];
}

export const prisma = global.__prisma || new PrismaClient(prismaOptions);

if (env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

// Soft delete middleware
prisma.$use(async (params, next) => {
  // Models that support soft delete
  const softDeleteModels = ['User', 'Organization', 'Project'];

  if (params.model && softDeleteModels.includes(params.model)) {
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      params.args.where = { ...params.args.where, deletedAt: null };
    }
    
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      } else {
        params.args.where = { deletedAt: null };
      }
    }
    
    if (params.action === 'delete') {
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }
    }
  }

  return next(params);
});
