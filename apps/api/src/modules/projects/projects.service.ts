import { PrismaClient } from '@prisma/client';
import { AppError, ERROR_CODES } from '@/shared/errors/app-error';
import { projectRepository, ProjectRepository } from './projects.repository';
import { prisma as prismaClient } from '@/lib/prisma';

export class ProjectService {
  constructor(
    private readonly repo: ProjectRepository = projectRepository,
    private readonly prisma: PrismaClient = prismaClient
  ) {}

  public async createProject(userId: string, data: any) {
    const existing = await this.repo.findBySlug(data.slug, data.workspaceId);
    if (existing && !existing.deletedAt) {
      throw new AppError(ERROR_CODES.CONFLICT, 'Project slug already in use in this workspace');
    }

    const project = await this.prisma.$transaction(async (tx) => {
      const createdProject = await tx.project.create({
        data: {
          ...data,
          createdById: userId,
        },
      });

      // Automatically make creator an owner in collaborators
      await tx.projectCollaborator.create({
        data: {
          projectId: createdProject.id,
          userId,
          permission: 'OWNER',
          addedById: userId,
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'PROJECT_CREATED',
          userId,
          metadata: { projectId: createdProject.id, workspaceId: data.workspaceId },
        },
      });

      return createdProject;
    });

    return project;
  }

  public async getProject(projectId: string, userId: string) {
    const project = await this.repo.findById(projectId);
    if (!project || project.deletedAt) {
      throw new AppError(ERROR_CODES.NOT_FOUND, 'Project not found');
    }

    // Check if user has access to the project's workspace
    const hasWorkspaceAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId: project.workspaceId, userId }
    });

    if (!hasWorkspaceAccess) {
       throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this project');
    }

    return project;
  }

  public async getProjects(workspaceId: string, userId: string, page: number, limit: number, search?: string) {
    // Validate workspace access
    const hasWorkspaceAccess = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId }
    });

    if (!hasWorkspaceAccess) {
       throw new AppError(ERROR_CODES.FORBIDDEN, 'Access denied to this workspace');
    }

    const skip = (page - 1) * limit;
    const { data, total } = await this.repo.findMany(workspaceId, { skip, take: limit }, search);
    return { data, total, page, limit };
  }

  public async updateProject(projectId: string, data: any, actorId: string) {
    const project = await this.getProject(projectId, actorId); // getProject checks workspace access
    
    // Additional check: Ensure user is a project collaborator with EDIT or OWNER perms, or workspace Admin
    // For simplicity we allow workspace members to edit if visibility allows or they are collaborators.
    // Assuming workspace access is enough for this initial CRUD.

    if (data.slug && data.slug !== project.slug) {
      const existing = await this.repo.findBySlug(data.slug, project.workspaceId);
      if (existing && existing.id !== projectId && !existing.deletedAt) {
         throw new AppError(ERROR_CODES.CONFLICT, 'Project slug already in use in this workspace');
      }
    }

    const updated = await this.repo.update(projectId, data);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'PROJECT_UPDATED',
        userId: actorId,
        metadata: { projectId, updates: data },
      },
    });

    return updated;
  }

  public async deleteProject(projectId: string, actorId: string) {
    await this.getProject(projectId, actorId); // Verify access
    await this.repo.softDelete(projectId);
    
    await this.prisma.auditLog.create({
      data: {
        action: 'PROJECT_DELETED',
        userId: actorId,
        metadata: { projectId },
      },
    });
  }
}

export const projectService = new ProjectService();
