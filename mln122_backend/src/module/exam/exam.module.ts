import { IExamRepository } from './interfaces/iexam.repository'
import { ExamRepository } from './exam.repository'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Exam, ExamSchema } from './schemas/exam.schema'
import { ExamService } from './exam.service'
import { IExamService } from './interfaces/iexam.service'
import { ExamController } from './exam.controller'
import { RoleModule } from '../role/role.module'
import { SubjectModule } from '../subject/subject.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    RoleModule,
    SubjectModule,
  ],
  controllers: [ExamController],
  providers: [
    {
      provide: IExamService,
      useClass: ExamService,
    },
    {
      provide: IExamRepository,
      useClass: ExamRepository,
    },
  ],
  exports: [IExamService, IExamRepository],
})
export class ExamModule {}
