import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async getUser(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role === 3) {
      return await this.usersRepository.find();
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  async banUser(userId: number, banUserId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role != 3) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const banUser = await this.usersRepository.findOne({ where: { id: banUserId } });
    if (!banUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (banUser.status == 0) {
      throw new HttpException('User already banned', HttpStatus.BAD_REQUEST);
    }
    await this.usersRepository.update(banUserId, { status: 0 });
    return new HttpException('User banned', HttpStatus.OK);
  }

  async unbanUser(userId: number, unbanUserId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.role != 3) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const unbanUser = await this.usersRepository.findOne({ where: { id: unbanUserId } });
    if (!unbanUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (unbanUser.status == 1) {
      throw new HttpException('User already unbanned', HttpStatus.BAD_REQUEST);
    }
    await this.usersRepository.update(unbanUserId, { status: 1 });
    return new HttpException('User unbanned', HttpStatus.OK);
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
