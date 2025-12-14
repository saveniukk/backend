import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  create(@Body() createUserDto: CreateUserDto): User {
    return this.usersService.create(createUserDto);
  }

  @Get('users')
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get('user/:id')
  findOne(@Param('id') id: string): User {
    return this.usersService.findOne(id);
  }

  @Delete('user/:id')
  remove(@Param('id') id: string) {
    this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
