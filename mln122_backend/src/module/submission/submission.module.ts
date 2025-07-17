import { ISubmissionRepository } from './interfaces/isubmission.repository'
import { ISubmissionService } from './interfaces/isubmission.service'
import { Module } from '@nestjs/common'
import { SubmissionController } from './submission.controller'
import { SubmissionService } from './submission.service'
import { SubmissionRepository } from './submission.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Submission, SubmissionSchema } from './schemas/submission.schema'
import { ExamModule } from '../exam/exam.module'
import { RoleModule } from '../role/role.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Submission.name, schema: SubmissionSchema },
    ]),
    ExamModule,
    RoleModule,
  ],
  controllers: [SubmissionController],
  providers: [
    {
      provide: ISubmissionRepository,
      useClass: SubmissionRepository,
    },
    {
      provide: ISubmissionService,
      useClass: SubmissionService,
    },
  ],
  exports: [ISubmissionRepository, ISubmissionService],
})
export class SubmissionModule {}
