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
  CreateBlockInput,
  createBlockSchema,
  UpdateBlockInput,
  updateBlockSchema,
} from '@notely/validators';
import { CurrentUser } from '../common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BlocksService } from './blocks.service';

@Controller('blocks')
export class BlocksController {
  constructor(private blocksService: BlocksService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(createBlockSchema)) body: CreateBlockInput,
  ) {
    return this.blocksService.create(user.id, body);
  }

  @Get()
  async findByPage(
    @CurrentUser() user: { id: string },
    @Query('pageId') pageId: string,
  ) {
    return this.blocksService.findByPage(pageId, user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.blocksService.findOne(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(updateBlockSchema)) body: UpdateBlockInput,
  ) {
    return this.blocksService.update(id, user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.blocksService.delete(id, user.id);
  }
}
