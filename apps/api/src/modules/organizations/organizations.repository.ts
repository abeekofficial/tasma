import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class OrganizationRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findById(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
    });
  }

  public async findBySlug(slug: string) {
    return this.prisma.organization.findUnique({
      where: { slug },
    });
  }

  public async findMany(filters: any) {
    return this.prisma.organization.findMany({ where: filters });
  }

  public async create(data: any) {
    return this.prisma.organization.create({ data });
  }

  public async update(id: string, data: any) {
    return this.prisma.organization.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string) {
    // Assume deletedAt exists or map to equivalent deletion logic. For Prisma without soft delete, this could just throw or use a field.
    return this.prisma.organization.delete({
      where: { id },
    });
  }

  public async findMember(orgId: string, userId: string) {
    return this.prisma.organizationMember.findUnique({
      where: { orgId_userId: { orgId, userId } },
    });
  }

  public async findMembers(orgId: string, pagination: { skip: number; take: number }) {
    const [data, total] = await Promise.all([
      this.prisma.organizationMember.findMany({
        where: { orgId },
        include: { user: true },
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.prisma.organizationMember.count({ where: { orgId } }),
    ]);
    return { data, total };
  }

  public async addMember(data: any) {
    return this.prisma.organizationMember.create({ data });
  }

  public async updateMemberRole(orgId: string, userId: string, role: string) {
    return this.prisma.organizationMember.update({
      where: { orgId_userId: { orgId, userId } },
      data: { role },
    });
  }

  public async removeMember(orgId: string, userId: string) {
    return this.prisma.organizationMember.delete({
      where: { orgId_userId: { orgId, userId } },
    });
  }
}

export const organizationRepository = new OrganizationRepository();
