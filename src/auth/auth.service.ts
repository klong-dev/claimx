import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  create(createAuthDto: any) {
    return null;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({ where: { email: signInDto.email } });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (user.status === 0) {
      throw new HttpException('User is banned', HttpStatus.FORBIDDEN);
    }

    const { password, ...payload } = user;
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  googleSignIn(user: any) {
    return 'This action adds a new auth';
  }
}
