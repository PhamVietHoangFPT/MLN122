// src/role/role.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Subject, SubjectSchema } from './schemas/subject.schema'
import { SubjectController } from './subject.controller'
import { ISubjectRepository } from './interfaces/isubject.repository'
import { SubjectRepository } from './subject.repository'
import { ISubjectService } from './interfaces/isubject.service'
import { SubjectService } from './subject.service'
import { RoleModule } from '../role/role.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subject.name, schema: SubjectSchema }]),
    RoleModule,
  ],
  controllers: [SubjectController],
  providers: [
    {
      provide: ISubjectRepository,
      useClass: SubjectRepository,
    },
    {
      provide: ISubjectService,
      useClass: SubjectService,
    },
  ],
  exports: [ISubjectRepository, ISubjectService],
})
export class SubjectModule {}
