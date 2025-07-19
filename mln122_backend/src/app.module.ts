import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { databaseConfig } from './config/database.config'
import { AuthModule } from './module/auth/auth.module'
import { RoleModule } from './module/role/role.module'
import { SubjectModule } from './module/subject/subject.module'
import { ExamModule } from './module/exam/exam.module'
import { SubmissionModule } from './module/submission/submission.module'
import { ScheduleModule } from '@nestjs/schedule'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    databaseConfig,
    AuthModule,
    RoleModule,
    SubjectModule,
    ExamModule,
    SubmissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
