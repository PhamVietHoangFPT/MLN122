import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { IExamRepository } from './interfaces/iexam.repository'
import { Exam, ExamDocument } from './schemas/exam.schema'
import { CreateExamDto } from './dto/createExam.dto'
import { UpdateExamDto } from './dto/updateExam.dto'
import { FilterQuery } from 'mongoose'

@Injectable()
export class ExamRepository implements IExamRepository {
  constructor(@InjectModel(Exam.name) private examModel: Model<ExamDocument>) {}
  async create(
    createExamDto: CreateExamDto,
    userId: string,
  ): Promise<ExamDocument> {
    const createdExam = new this.examModel({
      ...createExamDto,
      created_by: new Types.ObjectId(userId),
      created_at: new Date(),
    })
    return createdExam.save()
  }

  async findAll(query: FilterQuery<ExamDocument>): Promise<ExamDocument[]> {
    return this.examModel
      .find({
        subject: query.subjectId,
      })
      .select('examCode title duration')
      .populate({
        path: 'subject',
        select: 'subjectName',
      })
      .lean()
      .exec()
  }

  async findById(id: string): Promise<ExamDocument | null> {
    return this.examModel
      .findById(id)
      .select('')
      .populate({
        path: 'subject',
        select: 'subjectName',
      })
      .lean()
      .exec()
  }

  async update(
    id: string,
    updateExamDto: UpdateExamDto,
    userId: string,
  ): Promise<ExamDocument | null> {
    // Chuyển đổi userId sang ObjectId nếu cần thiết
    const userIdChangeToObjectId = new Types.ObjectId(userId)
    return this.examModel
      .findByIdAndUpdate(
        id,
        {
          ...updateExamDto,
          updated_by: userIdChangeToObjectId,
          updated_at: new Date(),
        },
        { new: true },
      )
      .select('')
      .lean()
      .exec()
  }

  async delete(id: string, userId: string): Promise<ExamDocument | null> {
    // Chuyển đổi userId sang ObjectId nếu cần thiết
    const userIdChangeToObjectId = new Types.ObjectId(userId)
    return this.examModel
      .findByIdAndUpdate(
        id,
        { deleted_at: new Date(), deleted_by: userIdChangeToObjectId },
        { new: true },
      )
      .select('')
      .lean()
      .exec()
  }

  async findByExamCode(examCode: string): Promise<ExamDocument | null> {
    return this.examModel.findOne({ examCode }).lean().exec()
  }
}
