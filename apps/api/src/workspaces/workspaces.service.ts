import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, name: string, icon?: string) {
    const workspace = await this.prisma.workspace.create({
      data: {
        name,
        icon,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
      include: {
        members: {
          include: { user: { select: { id: true, email: true, name: true } } },
        },
      },
    });

    return workspace;
  }

  async findAll(userId: string) {
    const workspaces = await this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        _count: { select: { pages: true, members: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return workspaces;
  }

  async findOne(id: string, userId: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        members: {
          some: { userId },
        },
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: {
          include: {
            user: {
              select: { id: true, email: true, name: true, avatar: true },
            },
          },
        },
        _count: { select: { pages: true } },
      },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found or access denied');
    }

    return workspace;
  }

  async update(
    id: string,
    userId: string,
    data: { name?: string; icon?: string },
  ) {
    await this.checkOwnership(id, userId);

    const workspace = await this.prisma.workspace.update({
      where: { id },
      data,
    });

    return workspace;
  }

  async delete(id: string, userId: string) {
    await this.checkOwnership(id, userId);

    await this.prisma.workspace.delete({ where: { id } });

    return { message: 'Workspace deleted successfully' };
  }

  async checkAccess(workspaceId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.workspaceMember.findFirst({
      where: { workspaceId, userId },
    });

    return !!member;
  }

  private async checkOwnership(workspaceId: string, userId: string) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      throw new NotFoundException('Workspace not found');
    }

    if (workspace.ownerId !== userId) {
      throw new ForbiddenException(
        'Only workspace owner can perform this action',
      );
    }

    return workspace;
  }
}
