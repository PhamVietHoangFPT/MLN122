import { FilterQuery } from 'mongoose'
import { CreateExamDto } from '../dto/createExam.dto'
import { UpdateExamDto } from '../dto/updateExam.dto'
import { ExamDocument } from '../schemas/exam.schema'

export interface IExamRepository {
  create(createExamDto: CreateExamDto, userId: string): Promise<ExamDocument>

  findAll(query: FilterQuery<ExamDocument>): Promise<ExamDocument[]>

  findById(id: string): Promise<ExamDocument | null>

  update(
    id: string,
    updateExamDto: UpdateExamDto,
    userId: string,
  ): Promise<ExamDocument | null>

  delete(id: string, userId: string): Promise<ExamDocument | null>

  findByExamCode(examCode: string): Promise<ExamDocument | null>
}

export const IExamRepository = Symbol('IExamRepository')
