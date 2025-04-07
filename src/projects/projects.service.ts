import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UserProject } from 'src/user-project/entities/user-project.entity';
import { User } from 'src/users/entities/user.entity';
import { UserProjectDto } from './dto/user-project.dto';

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

  async removeProject(userId: number, idProject: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 3) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const project = await this.projectRepo.findOne({ where: { id: idProject } });
    if (!project) {
      throw new Error('Project not found');
    }
    return await this.projectRepo.remove(project);
  }

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

  async listMem(userId: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 3) {
      throw new Error('Unauthorized');
    }
    return await this.userProjectRepo.find({
      relations: ['user', 'project'],
      select: {
        role: true,
        status: true,
        user: {
          id: true,
          name: true,
          bankInfo: true,
          phone: true,
          email: true,
          role: true
        },
        project: {
          id: true,
          name: true
        }
      }
    });
  }

  async create(userId: number, createProjectDto: CreateProjectDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 3) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const project = this.projectRepo.create(createProjectDto);
    return await this.projectRepo.save(project);
  }

  async addMember(userId: number, userProjectDto: UserProjectDto) {
    const { projectId, memberId, role } = userProjectDto;
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 3) {
      throw new Error('Unauthorized');
    }
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new Error('Project not found');
    }
    const member = await this.userRepo.findOne({ where: { id: memberId } });
    if (!member) {
      throw new Error('Member not found');
    }
    const userProject = this.userProjectRepo.create({
      user: member,
      project: project,
      role
    });
    return await this.userProjectRepo.save(userProject);
  }
}
