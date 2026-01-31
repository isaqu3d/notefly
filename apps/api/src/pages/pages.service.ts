import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PageVisibility } from '@notely/types';
import { PrismaService } from '../database/prisma.service';
import { WorkspacesService } from '../workspaces/workspaces.service';

@Injectable()
export class PagesService {
  constructor(
    private prisma: PrismaService,
    private workspacesService: WorkspacesService,
  ) {}

  async create(
    userId: string,
    data: {
      title: string;
      workspaceId: string;
      parentId?: string;
      icon?: string;
      coverImage?: string;
      visibility?: PageVisibility;
    },
  ) {
    const hasAccess = await this.workspacesService.checkAccess(
      data.workspaceId,
      userId,
    );
    if (!hasAccess) {
      throw new ForbiddenException('No access to this workspace');
    }

    const page = await this.prisma.page.create({
      data: {
        title: data.title,
        workspaceId: data.workspaceId,
        authorId: userId,
        parentId: data.parentId,
        icon: data.icon,
        coverImage: data.coverImage,
        visibility: data.visibility || 'PRIVATE',
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });

    return page;
  }

  async findAll(
    userId: string,
    query: {
      workspaceId?: string;
      parentId?: string;
      page?: number;
      limit?: number;
    },
  ) {
    const where: {
      workspace: { members: { some: { userId: string } } };
      workspaceId?: string;
      parentId?: string | null;
    } = {
      workspace: {
        members: { some: { userId } },
      },
    };

    if (query.workspaceId) {
      where.workspaceId = query.workspaceId;
    }

    if (query.parentId === 'null' || query.parentId === null) {
      where.parentId = null;
    } else if (query.parentId) {
      where.parentId = query.parentId;
    }

    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const [pages, total] = await Promise.all([
      this.prisma.page.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          _count: { select: { children: true, blocks: true } },
        },
        orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.page.count({ where }),
    ]);

    return {
      data: pages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const page = await this.prisma.page.findFirst({
      where: {
        id,
        workspace: {
          members: { some: { userId } },
        },
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        parent: { select: { id: true, title: true, icon: true } },
        _count: { select: { children: true, blocks: true } },
      },
    });

    if (!page) {
      throw new NotFoundException('Page not found or access denied');
    }

    return page;
  }

  async findChildren(pageId: string, userId: string) {
    await this.findOne(pageId, userId);

    const children = await this.prisma.page.findMany({
      where: { parentId: pageId },
      include: {
        author: { select: { id: true, name: true, email: true } },
        _count: { select: { children: true, blocks: true } },
      },
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });

    return children;
  }

  async update(
    id: string,
    userId: string,
    data: {
      title?: string;
      icon?: string;
      coverImage?: string;
      visibility?: PageVisibility;
      parentId?: string | null;
      position?: number;
    },
  ) {
    await this.findOne(id, userId);

    const updated = await this.prisma.page.update({
      where: { id },
      data,
    });

    return updated;
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.page.delete({ where: { id } });

    return { message: 'Page deleted successfully' };
  }
}
