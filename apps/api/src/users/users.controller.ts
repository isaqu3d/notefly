import { Controller, Get, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../common';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: { id: string; email: string }) {
    return this.usersService.findMe(user.id);
  }

  @Put('me')
  async updateMe(
    @CurrentUser() user: { id: string; email: string },
    @Body() body: { name?: string; avatar?: string },
  ) {
    return this.usersService.updateMe(user.id, body);
  }
}
