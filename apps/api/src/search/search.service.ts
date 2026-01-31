import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(userId: string, query: string, workspaceId?: string) {
    const whereWorkspace = workspaceId
      ? { workspaceId }
      : {
          workspace: {
            members: { some: { userId } },
          },
        };

    const [pages, blocks] = await Promise.all([
      this.prisma.page.findMany({
        where: {
          ...whereWorkspace,
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          workspace: { select: { id: true, name: true, icon: true } },
          author: { select: { id: true, name: true, email: true } },
        },
        take: 20,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.block.findMany({
        where: {
          page: whereWorkspace,
          content: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: {
          page: {
            include: {
              workspace: { select: { id: true, name: true, icon: true } },
            },
          },
        },
        take: 20,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      pages,
      blocks: blocks.map((block) => ({
        ...block,
        workspace: block.page.workspace,
      })),
      total: pages.length + blocks.length,
    };
  }
}
