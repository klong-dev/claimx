import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
}
