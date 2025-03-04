import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(UserProject)
    private userProjectRepo: Repository<UserProject>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async findByUser(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const userProjects = await this.userProjectRepo.find({
      where: { user: { id: userId } },
      relations: {
        project: true
      }
    }
    );
    const projectIds = userProjects.map(up => up.project.id);
    return await this.projectRepo.find({
      where: { id: In(projectIds) },
      relations: {
        userProjects: {
          user: true
        }
      },
      select: {
        userProjects: {
          role: true,
          user: {
            name: true,
            bankInfo: true
          }
        }
      }
    });
  }

  async findAll(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 3) {
      throw new Error('Unauthorized');
    }
    return await this.projectRepo.find({
      relations: ['userProjects', 'userProjects.user'],
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        userProjects: {
          role: true,
          user: {
            name: true,
            bankInfo: true
          }
        }
      }
    });
  }
}
