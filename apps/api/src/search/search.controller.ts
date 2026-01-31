import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { CurrentUser } from '../common';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(
    @CurrentUser() user: { id: string },
    @Query('query') query: string,
    @Query('workspaceId') workspaceId?: string,
  ) {
    return this.searchService.search(user.id, query, workspaceId);
  }
}
