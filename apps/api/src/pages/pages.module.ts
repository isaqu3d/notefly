import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [WorkspacesModule],
  providers: [PagesService],
  controllers: [PagesController],
  exports: [PagesService],
})
export class PagesModule {}
