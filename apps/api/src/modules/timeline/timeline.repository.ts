import { PrismaClient } from '@prisma/client';
import { prisma as prismaClient } from '@/lib/prisma';

export class TimelineRepository {
  constructor(private readonly prisma: PrismaClient = prismaClient) {}

  public async findByProjectId(projectId: string) {
    return this.prisma.timeline.findUnique({
      where: { projectId },
      include: {
        tracks: {
          include: {
            clips: {
              include: {
                effects: true,
                keyframes: true
              }
            }
          }
        },
        transitions: true
      }
    });
  }

  public async create(data: any) {
    return this.prisma.timeline.create({
      data,
      include: {
        tracks: true,
      }
    });
  }

  public async update(projectId: string, data: any) {
    return this.prisma.timeline.update({
      where: { projectId },
      data,
    });
  }

  public async syncFullTimeline(projectId: string, tracks: any[], duration?: number) {
    // A simplified full sync approach for phase 9.3:
    // In a real high-perf scenario, we'd do incremental updates.
    // For now, we update the timeline data using Prisma nested transactions if needed.
    // However, since schema.prisma has complex nested relations, we might just store JSON for tracks in settings or manually manage them.
    // Given the models exist, let's just do a basic update.
    
    // For the sake of this scaffolding, we update the top-level timeline and leave track sync logic for the service.
    
    return this.prisma.$transaction(async (tx) => {
      // Basic update
      const timeline = await tx.timeline.update({
        where: { projectId },
        data: {
          duration: duration !== undefined ? duration : undefined,
          version: { increment: 1 }
        }
      });
      return timeline;
    });
  }
}

export const timelineRepository = new TimelineRepository();
