import { SubjectResponseDto } from '../dto/subjectResponse.dto'
import { CreateSubjectDto } from '../dto/createSubject.dto'

export interface ISubjectService {
  createSubject(
    subjectName: CreateSubjectDto,
    userId: string,
  ): Promise<SubjectResponseDto>
  getSubjectById(id: string): Promise<SubjectResponseDto | null>
  updateSubject(
    id: string,
    subject: CreateSubjectDto,
    userId: string,
  ): Promise<SubjectResponseDto | null>
  deleteSubject(id: string, userId: string): Promise<boolean>
  getAllSubjects(): Promise<SubjectResponseDto[]>
}

export const ISubjectService = Symbol('ISubjectService')
