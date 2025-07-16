import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Subject, SubjectDocument } from './schemas/subject.schema'
import { ISubjectRepository } from './interfaces/isubject.repository'
import { CreateSubjectDto } from './dto/createSubject.dto'

@Injectable() // Quan trọng: Đánh dấu là injectable
export class SubjectRepository implements ISubjectRepository {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async createSubject(subject: CreateSubjectDto): Promise<SubjectDocument> {
    const createdSubject = new this.subjectModel(subject)
    return await createdSubject.save()
  }

  async getAllSubjects(): Promise<SubjectDocument[]> {
    return this.subjectModel.find({ deleted_at: null }).exec()
  }

  async getSubjectById(id: string): Promise<SubjectDocument | null> {
    return this.subjectModel.findById(id).exec()
  }

  async updateSubject(
    id: string,
    subject: CreateSubjectDto,
  ): Promise<SubjectDocument | null> {
    return this.subjectModel
      .findByIdAndUpdate(id, { ...subject }, { new: true })
      .exec()
  }

  async deleteSubject(id: string, subject: Partial<Subject>): Promise<boolean> {
    const result = await this.subjectModel
      .findByIdAndUpdate(id, { ...subject })
      .exec()
    return !!result
  }

  async checkSubjectExists(
    subjectName: string,
  ): Promise<SubjectDocument | null> {
    const subject = await this.subjectModel.findOne({ subjectName }).exec()
    return subject
  }
}
