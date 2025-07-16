import { CreateSubjectDto } from '../dto/createSubject.dto'
import { Subject, SubjectDocument } from '../schemas/subject.schema'

export interface ISubjectRepository {
  createSubject(subject: CreateSubjectDto): Promise<SubjectDocument>
  getSubjectById(id: string): Promise<SubjectDocument | null>
  getAllSubjects(): Promise<SubjectDocument[]>
  updateSubject(
    id: string,
    subject: CreateSubjectDto,
  ): Promise<SubjectDocument | null>
  deleteSubject(id: string, subject: Partial<Subject>): Promise<boolean>
  checkSubjectExists(subjectName: string): Promise<SubjectDocument | null>
}

export const ISubjectRepository = Symbol('ISubjectRepository')
