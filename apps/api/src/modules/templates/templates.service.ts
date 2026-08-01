import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { templateRepository, TemplateRepository } from './templates.repository';
import { prisma as prismaClient } from '@/lib/prisma';

export class TemplateService {
  constructor(
    private readonly repo: TemplateRepository = templateRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async createTemplate(userId: string, data: any) {
    // If organizationId is provided, check access
    if (data.organizationId) {
       const orgMember = await this.prisma.organizationMember.findFirst({
         where: { organizationId: data.organizationId, userId }
       });
       if (!orgMember) {
         throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this organization');
       }
    }

    const existing = await this.repo.findBySlug(data.slug, data.organizationId);
    if (existing && !existing.deletedAt) {
      throw new AppError(ERROR_CODES.CONFLICT, 'Template slug already in use');
    }

    const template = await this.repo.create({
      ...data,
      createdById: userId,
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'TEMPLATE_CREATED',
        userId,
        metadata: { templateId: template.id },
      },
    });

    return template;
  }

  public async getTemplate(templateId: string, userId: string) {
    const template = await this.repo.findById(templateId);
    if (!template || template.deletedAt) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Template not found');
    }

    if (!template.isPublic && template.organizationId) {
      const orgMember = await this.prisma.organizationMember.findFirst({
        where: { organizationId: template.organizationId, userId }
      });
      if (!orgMember && template.createdById !== userId) {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this template');
      }
    }

    return template;
  }

  public async listTemplates(userId: string, filters: any, page: number, limit: number) {
    // Basic access control
    if (filters.organizationId) {
      const orgMember = await this.prisma.organizationMember.findFirst({
        where: { organizationId: filters.organizationId, userId }
      });
      if (!orgMember) {
        throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this organization');
      }
    } else {
      // If no org specified, only return public templates
      filters.isPublic = true;
    }

    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findMany(filters, { skip, take: limit });
    return { data, total, page, limit };
  }

  public async updateTemplate(templateId: string, data: any, actorId: string) {
    const template = await this.getTemplate(templateId, actorId);
    
    // Only creator or org admin can update (simplification)
    if (template.createdById !== actorId) {
      if (template.organizationId) {
        const orgMember = await this.prisma.organizationMember.findFirst({
          where: { organizationId: template.organizationId, userId: actorId }
        });
        if (!orgMember || !['ADMIN', 'OWNER'].includes(orgMember.role)) {
          throw new AppError(ERROR_CODES.FORBIDDEN, 'Only creators or admins can update templates');
        }
      } else {
         throw new AppError(ERROR_CODES.FORBIDDEN, 'Only creator can update this template');
      }
    }

    if (data.slug && data.slug !== template.slug) {
      const existing = await this.repo.findBySlug(data.slug, template.organizationId || undefined);
      if (existing && existing.id !== templateId && !existing.deletedAt) {
         throw new AppError(ERROR_CODES.CONFLICT, 'Template slug already in use');
      }
    }

    const updated = await this.repo.update(templateId, data);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'TEMPLATE_UPDATED',
        userId: actorId,
        metadata: { templateId, updates: data },
      },
    });

    return updated;
  }

  public async deleteTemplate(templateId: string, actorId: string) {
    const template = await this.getTemplate(templateId, actorId);
    
    if (template.createdById !== actorId) {
      if (template.organizationId) {
        const orgMember = await this.prisma.organizationMember.findFirst({
          where: { organizationId: template.organizationId, userId: actorId }
        });
        if (!orgMember || !['ADMIN', 'OWNER'].includes(orgMember.role)) {
          throw new AppError(ERROR_CODES.FORBIDDEN, 'Only creators or admins can delete templates');
        }
      } else {
         throw new AppError(ERROR_CODES.FORBIDDEN, 'Only creator can delete this template');
      }
    }

    await this.repo.softDelete(templateId);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'TEMPLATE_DELETED',
        userId: actorId,
        metadata: { templateId },
      },
    });
  }
}

export const templateService = new TemplateService();
