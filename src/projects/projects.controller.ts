import { Controller, Get, Post, Req, UseGuards, Body, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  findByUser(@Req() req) {
    const userId = req.user.id;
    return this.projectsService.findByUser(userId);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.projectsService.findAll(userId);
  }

  @Get('mem')
  @UseGuards(JwtAuthGuard)
  findMembers(@Req() req) {
    const userId = req.user.id;
    return this.projectsService.listMem(userId);
  }

  @Post('mem')
  @UseGuards(JwtAuthGuard)
  addMember(@Req() req, @Body() userProjectDto) {
    const userId = req.user.id;
    return this.projectsService.addMember(userId, userProjectDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    const userId = req.user.id;
    return this.projectsService.create(userId, createProjectDto);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  removeProject(@Req() req, @Body() userProjectDto) {
    const userId = req.user.id;
    return this.projectsService.removeProject(userId, userProjectDto);
  }
}
