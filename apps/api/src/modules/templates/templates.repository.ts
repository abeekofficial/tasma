import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class TemplateRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findById(id: string) {
    return this.prisma.template.findUnique({
      where: { id },
    });
  }

  public async findBySlug(slug: string, organizationId?: string) {
    const where: any = { slug };
    if (organizationId) {
      where.organizationId = organizationId;
    }
    return this.prisma.template.findFirst({
      where,
    });
  }

  public async findMany(filters: { organizationId?: string; isPublic?: boolean; category?: string; search?: string }, pagination: { skip: number; take: number }) {
    const whereClause: any = { deletedAt: null };
    
    if (filters.organizationId) {
      whereClause.organizationId = filters.organizationId;
    } else if (filters.isPublic) {
      whereClause.isPublic = true;
    }

    if (filters.category) {
      whereClause.category = filters.category;
    }

    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.template.findMany({
        where: whereClause,
        include: { creator: { select: { id: true, name: true, avatarUrl: true } } },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.template.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  public async create(data: any) {
    return this.prisma.template.create({ data });
  }

  public async update(id: string, data: any) {
    return this.prisma.template.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string) {
    return this.prisma.template.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const templateRepository = new TemplateRepository();
