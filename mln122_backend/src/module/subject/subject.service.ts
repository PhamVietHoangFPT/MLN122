import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { Subject } from './schemas/subject.schema'
import { ISubjectRepository } from './interfaces/isubject.repository'
import { SubjectResponseDto } from './dto/subjectResponse.dto'
import { ISubjectService } from './interfaces/isubject.service'
import { isValidObjectId, Types } from 'mongoose'
import { CreateSubjectDto } from './dto/createSubject.dto'
@Injectable()
export class SubjectService implements ISubjectService {
  constructor(
    @Inject(ISubjectRepository) private subjectRepository: ISubjectRepository,
  ) {}

  private mapToDto(subject: Subject): SubjectResponseDto {
    return new SubjectResponseDto({
      _id: subject._id,
      subjectName: subject.subjectName,
    })
  }

  async createSubject(
    subject: CreateSubjectDto,
    userId: string,
  ): Promise<SubjectResponseDto> {
    const existingSubject = await this.subjectRepository.checkSubjectExists(
      subject.subjectName,
    )
    if (existingSubject) {
      throw new ConflictException(
        `Môn học với tên ${subject.subjectName} đã tồn tại`,
      )
    }
    const userIdChangeToObjectId = new Types.ObjectId(userId)
    const sendData = {
      subjectName: subject.subjectName,
      created_by:
        userIdChangeToObjectId as unknown as import('mongoose').Schema.Types.ObjectId,
      created_at: new Date(),
    }
    const createdSubject = await this.subjectRepository.createSubject(sendData)
    return this.mapToDto(createdSubject)
  }

  async getSubjectById(id: string): Promise<SubjectResponseDto | null> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('ID môn học không hợp lệ')
    }
    const subject = await this.subjectRepository.getSubjectById(id)
    if (!subject) {
      throw new NotFoundException(`Không tìm thấy môn học với ID ${id}`)
    }
    return this.mapToDto(subject)
  }

  async updateSubject(
    id: string,
    subject: Subject,
    userId: string,
  ): Promise<SubjectResponseDto | null> {
    const existingSubject = await this.subjectRepository.getSubjectById(id)
    if (!existingSubject) {
      throw new NotFoundException(`Không tìm thấy môn học với ID ${id}`)
    }

    const existingSubjectName = await this.subjectRepository.checkSubjectExists(
      subject.subjectName,
    )
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    if (existingSubjectName && existingSubjectName._id.toString() !== id) {
      throw new ConflictException(
        `Môn học với tên ${subject.subjectName} đã tồn tại`,
      )
    }
    const userIdChangeToObjectId = new Types.ObjectId(userId)

    const sendData = {
      ...subject,
      updated_by:
        userIdChangeToObjectId as unknown as import('mongoose').Schema.Types.ObjectId,
      updated_at: new Date(),
    }

    const updatedSubject = await this.subjectRepository.updateSubject(
      id,
      sendData,
    )
    if (!updatedSubject) {
      throw new NotFoundException(`Cập nhật thất bại cho môn học với ID ${id}`)
    }
    return this.mapToDto(updatedSubject)
  }

  async deleteSubject(id: string, userId: string): Promise<boolean> {
    const existingSubject = await this.subjectRepository.getSubjectById(id)
    if (!existingSubject) {
      throw new NotFoundException(`Không tìm thấy môn học với ID ${id}`)
    }
    const userIdChangeToObjectId = new Types.ObjectId(userId)
    const sendData = {
      deleted_by:
        userIdChangeToObjectId as unknown as import('mongoose').Schema.Types.ObjectId,
      deleted_at: new Date(),
    }
    return this.subjectRepository.deleteSubject(id, sendData)
  }

  async getAllSubjects(): Promise<SubjectResponseDto[]> {
    const subjects = await this.subjectRepository.getAllSubjects()
    if (!subjects || subjects.length === 0) {
      throw new NotFoundException('Không tìm thấy môn học nào')
    }
    return subjects.map((subject) => this.mapToDto(subject))
  }
}
