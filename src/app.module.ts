import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './projects/projects.module';
import { UserProjectModule } from './user-project/user-project.module';
import { ClaimRequestModule } from './claim-request/claim-request.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClaimModule } from './claim/claim.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(
      {
        isGlobal: true,
      },
    ),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
    DatabaseModule, UsersModule, DepartmentsModule, ProjectsModule, UserProjectModule, ClaimRequestModule, ClaimModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
