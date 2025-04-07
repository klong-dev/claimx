import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@Req() req) {
    const userId = req.user.id;
    return this.usersService.getUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Post('ban/:id')
  @UseGuards(JwtAuthGuard)
  banUser(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.usersService.banUser(userId, +id);
  }

  @Post('unban/:id')
  @UseGuards(JwtAuthGuard)
  unbanUser(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.usersService.unbanUser(userId, +id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
