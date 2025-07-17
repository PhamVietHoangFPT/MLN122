import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { IExamService } from './interfaces/iexam.service'
import { IExamRepository } from './interfaces/iexam.repository'
import { CreateExamDto } from './dto/createExam.dto'
import { UpdateExamDto } from './dto/updateExam.dto'
import { ExamResponseDto } from './dto/examResponse.dto'
import { ExamForStudentDto } from './dto/examForStudent.dto'
import { ExamDocument } from './schemas/exam.schema'
import { FilterQuery } from 'mongoose'
import { ISubjectRepository } from '../subject/interfaces/isubject.repository'

@Injectable()
export class ExamService implements IExamService {
  constructor(
    @Inject(IExamRepository)
    private readonly examRepository: IExamRepository,
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
  ) {}

  async create(
    createExamDto: CreateExamDto,
    userId: string,
  ): Promise<ExamResponseDto> {
    const existingExam = await this.examRepository.findByExamCode(
      createExamDto.examCode,
    )
    if (existingExam) {
      throw new ConflictException('Mã đề thi đã tồn tại')
    }
    const data = await this.examRepository.create(createExamDto, userId)
    if (!data) {
      throw new NotFoundException('Không thể tạo đề thi')
    }

    return new ExamResponseDto(data)
  }

  async findAll(query: FilterQuery<ExamDocument>): Promise<ExamResponseDto[]> {
    if (query.subjectId) {
      const subject = await this.subjectRepository.getSubjectById(
        query.subjectId as string,
      )
      if (!subject) {
        throw new NotFoundException('Môn học không tồn tại')
      }
    }
    const exams = await this.examRepository.findAll(query)
    if (!exams || exams.length === 0) {
      throw new NotFoundException('Không tìm thấy đề thi nào')
    }
    return exams.map((exam) => new ExamResponseDto(exam))
  }

  async findById(id: string): Promise<ExamResponseDto | null> {
    const exam = await this.examRepository.findById(id)
    if (!exam) {
      throw new NotFoundException('Đề thi không tồn tại')
    }
    return new ExamResponseDto(exam)
  }

  async update(
    id: string,
    updateExamDto: UpdateExamDto,
    userId: string,
  ): Promise<ExamResponseDto | null> {
    const updatedExam = await this.examRepository.update(
      id,
      updateExamDto,
      userId,
    )
    if (!updatedExam) {
      throw new NotFoundException('Đề thi không tồn tại')
    }
    return new ExamResponseDto(updatedExam)
  }

  async delete(id: string, userId: string): Promise<ExamResponseDto | null> {
    const deletedExam = await this.examRepository.delete(id, userId)
    if (!deletedExam) {
      throw new NotFoundException('Đề thi không tồn tại')
    }
    return new ExamResponseDto(deletedExam)
  }

  async findByIdForStudent(id: string): Promise<ExamForStudentDto | null> {
    const data = await this.examRepository.findById(id)
    if (!data) {
      throw new NotFoundException('Đề thi không tồn tại')
    }
    return new ExamForStudentDto(data)
  }
}
