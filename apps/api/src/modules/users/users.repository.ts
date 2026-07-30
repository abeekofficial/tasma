import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        organizationMembers: {
          include: {
            organization: true,
          },
        },
      },
    });
  }

  public async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async findMany(filters: { search?: string; role?: string; status?: string; page: number; limit: number }) {
    const { search, role, status, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  public async update(id: string, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: 'DELETED',
        deletedAt: new Date(),
      },
    });
  }

  public async restore(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
  }

  public async count(filters?: any) {
    return this.prisma.user.count({ where: filters });
  }
}

export const userRepository = new UserRepository();
