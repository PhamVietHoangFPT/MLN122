import { CreateExamDto } from '../dto/createExam.dto'
import { UpdateExamDto } from '../dto/updateExam.dto'
import { ExamResponseDto } from '../dto/examResponse.dto'
import { ExamForStudentDto } from '../dto/examForStudent.dto'
import { ExamDocument } from '../schemas/exam.schema'
import { FilterQuery } from 'mongoose'

export interface IExamService {
  create(createExamDto: CreateExamDto, userId: string): Promise<boolean>

  findAll(query: FilterQuery<ExamDocument>): Promise<ExamResponseDto[]>

  findById(id: string): Promise<ExamResponseDto | null>

  update(
    id: string,
    updateExamDto: UpdateExamDto,
    userId: string,
  ): Promise<ExamResponseDto | null>

  delete(id: string, userId: string): Promise<ExamResponseDto | null>

  findByIdForStudent(id: string): Promise<ExamForStudentDto | null>
}

export const IExamService = Symbol('IExamService')
