import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PagesService } from '../pages/pages.service';
import { BlockType } from '@notely/types';

@Injectable()
export class BlocksService {
  constructor(
    private prisma: PrismaService,
    private pagesService: PagesService,
  ) {}

  async create(
    userId: string,
    data: {
      type: BlockType;
      pageId: string;
      parentId?: string | null;
      position?: number;
      content?: string;
      checked?: boolean;
      url?: string;
      caption?: string;
      width?: number;
      height?: number;
      language?: string;
      icon?: string;
      color?: string;
    },
  ) {
    await this.pagesService.findOne(data.pageId, userId);

    const block = await this.prisma.block.create({
      data: {
        type: data.type,
        pageId: data.pageId,
        parentId: data.parentId,
        position: data.position,
        content: data.content,
        checked: data.checked,
        url: data.url,
        caption: data.caption,
        width: data.width,
        height: data.height,
        language: data.language,
        icon: data.icon,
        color: data.color,
      },
    });

    return block;
  }

  async findByPage(pageId: string, userId: string) {
    await this.pagesService.findOne(pageId, userId);

    const blocks = await this.prisma.block.findMany({
      where: { pageId },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
    });

    return blocks;
  }

  async findOne(id: string, userId: string) {
    const block = await this.prisma.block.findFirst({
      where: {
        id,
        page: {
          workspace: {
            members: { some: { userId } },
          },
        },
      },
      include: {
        page: { select: { id: true, title: true } },
        parent: { select: { id: true, type: true, content: true } },
      },
    });

    if (!block) {
      throw new NotFoundException('Block not found or access denied');
    }

    return block;
  }

  async update(
    id: string,
    userId: string,
    data: {
      type?: BlockType;
      content?: string;
      checked?: boolean;
      position?: number;
      parentId?: string | null;
      url?: string;
      caption?: string;
      width?: number;
      height?: number;
      language?: string;
      icon?: string;
      color?: string;
    },
  ) {
    await this.findOne(id, userId);

    const block = await this.prisma.block.update({
      where: { id },
      data,
    });

    return block;
  }

  async delete(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.block.delete({ where: { id } });

    return { message: 'Block deleted successfully' };
  }
}
