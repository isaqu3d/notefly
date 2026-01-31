import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  CreatePageInput,
  createPageSchema,
  UpdatePageInput,
  updatePageSchema,
} from '@notely/validators';
import { CurrentUser } from '../common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PagesService } from './pages.service';

interface PagesQuery {
  workspaceId?: string;
  parentId?: string;
  page?: number;
  limit?: number;
}

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(createPageSchema)) body: CreatePageInput,
  ) {
    return this.pagesService.create(user.id, body);
  }

  @Get()
  async findAll(
    @CurrentUser() user: { id: string },
    @Query() query: PagesQuery,
  ) {
    return this.pagesService.findAll(user.id, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.pagesService.findOne(id, user.id);
  }

  @Get(':id/children')
  async findChildren(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.pagesService.findChildren(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(updatePageSchema)) body: UpdatePageInput,
  ) {
    return this.pagesService.update(id, user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.pagesService.delete(id, user.id);
  }
}
