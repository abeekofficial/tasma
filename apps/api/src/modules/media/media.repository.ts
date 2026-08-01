import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class MediaRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findById(id: string) {
    return this.prisma.mediaAsset.findUnique({
      where: { id },
    });
  }

  public async findMany(workspaceId: string, pagination: { skip: number; take: number }, filters?: { search?: string; type?: string }) {
    const whereClause: any = { workspaceId, deletedAt: null };
    
    if (filters?.search) {
      whereClause.name = { contains: filters.search, mode: 'insensitive' };
    }
    if (filters?.type) {
      whereClause.type = filters.type;
    }

    const [data, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where: whereClause,
        include: { uploader: { select: { id: true, name: true, avatarUrl: true } } },
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.mediaAsset.count({ where: whereClause }),
    ]);

    return { data, total };
  }

  public async create(data: any) {
    return this.prisma.mediaAsset.create({ data });
  }

  public async update(id: string, data: any) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const mediaRepository = new MediaRepository();
