import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DepartmentsModule } from './departments/departments.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(
    {
      isGlobal: true,
    },
  ), DatabaseModule, UsersModule, DepartmentsModule, ProjectsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
