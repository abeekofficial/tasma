import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class ProjectRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  public async findBySlug(slug: string, workspaceId: string) {
    return this.prisma.project.findFirst({
      where: { slug, workspaceId },
    });
  }

  public async findMany(workspaceId: string, pagination: { skip: number; take: number }, search?: string) {
    const whereClause: any = { workspaceId, deletedAt: null };
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where: whereClause,
        include: { creator: { select: { id: true, name: true, avatarUrl: true } } },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  public async create(data: any) {
    return this.prisma.project.create({ data });
  }

  public async update(id: string, data: any) {
    return this.prisma.project.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string) {
    return this.prisma.project.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const projectRepository = new ProjectRepository();
