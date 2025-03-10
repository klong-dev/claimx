import { Module } from '@nestjs/common';
import { ClaimRequestService } from './claim-request.service';
import { ClaimRequestController } from './claim-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ClaimRequest } from './entities/claim-request.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Claim } from 'src/claim/entities/claim.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClaimRequest, User, Claim]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [ClaimRequestController],
  providers: [ClaimRequestService],
})
export class ClaimRequestModule { }
