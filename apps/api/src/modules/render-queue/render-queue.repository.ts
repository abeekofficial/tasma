import { PrismaClient, Prisma } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class RenderQueueRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findById(id: string) {
    return this.prisma.renderJob.findUnique({
      where: { id },
      include: { logs: { orderBy: { timestamp: 'desc' }, take: 20 } },
    });
  }

  public async findMany(
    filters: {
      userId: string;
      projectId?: string;
      status?: string;
      type?: string;
      priority?: string;
    },
    pagination: { skip: number; take: number },
    sort: { field: string; order: 'asc' | 'desc' }
  ) {
    const whereClause: Prisma.RenderJobWhereInput = { userId: filters.userId };

    if (filters.projectId) whereClause.projectId = filters.projectId;
    if (filters.status) whereClause.status = filters.status as any;
    if (filters.type) whereClause.type = filters.type as any;
    if (filters.priority) whereClause.priority = filters.priority as any;

    const [data, total] = await Promise.all([
      this.prisma.renderJob.findMany({
        where: whereClause,
        include: {
          project: { select: { id: true, name: true, slug: true } },
        },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [sort.field]: sort.order },
      }),
      this.prisma.renderJob.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  public async create(data: Prisma.RenderJobUncheckedCreateInput) {
    return this.prisma.renderJob.create({
      data,
      include: { project: { select: { id: true, name: true, slug: true } } },
    });
  }

  public async update(id: string, data: Prisma.RenderJobUncheckedUpdateInput) {
    return this.prisma.renderJob.update({
      where: { id },
      data,
    });
  }

  public async delete(id: string) {
    return this.prisma.renderJob.delete({ where: { id } });
  }

  public async createLog(data: Prisma.RenderJobLogUncheckedCreateInput) {
    return this.prisma.renderJobLog.create({ data });
  }

  public async findLogsByJobId(renderJobId: string, take: number = 50) {
    return this.prisma.renderJobLog.findMany({
      where: { renderJobId },
      orderBy: { timestamp: 'desc' },
      take,
    });
  }

  public async countByStatus(userId: string) {
    const results = await this.prisma.renderJob.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    return results.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = row._count.id;
      return acc;
    }, {});
  }
}

export const renderQueueRepository = new RenderQueueRepository();
