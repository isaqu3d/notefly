import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { CurrentUser } from '../common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from '@notely/validators';

@Controller('workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Post()
  async create(
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(createWorkspaceSchema))
    body: { name: string; icon?: string },
  ) {
    return this.workspacesService.create(user.id, body.name, body.icon);
  }

  @Get()
  async findAll(@CurrentUser() user: { id: string }) {
    return this.workspacesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.workspacesService.findOne(id, user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
    @Body(new ZodValidationPipe(updateWorkspaceSchema))
    body: { name?: string; icon?: string },
  ) {
    return this.workspacesService.update(id, user.id, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.workspacesService.delete(id, user.id);
  }
}
