import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { Submission, SubmissionDocument } from './schemas/submission.schema'
import { ISubmissionRepository } from './interfaces/isubmission.repository'

// Định nghĩa lại các kiểu dữ liệu để sử dụng nội bộ
type InitialSubmissionData = {
  user: string
  exam: string
  startedAt: Date
  status: 'in-progress'
}

type FinalSubmissionData = {
  score: number
  finishedAt: Date
  answers: {
    questionNo: number
    chosenAnswerCode: string
    isCorrect: boolean
  }[]
  status: 'completed'
}

@Injectable()
export class SubmissionRepository implements ISubmissionRepository {
  constructor(
    @InjectModel(Submission.name)
    private readonly submissionModel: Model<SubmissionDocument>,
  ) {}

  async create(data: InitialSubmissionData): Promise<SubmissionDocument> {
    const newSubmission = new this.submissionModel(data)
    return await newSubmission.save()
  }

  async findById(id: string): Promise<SubmissionDocument | null> {
    return await this.submissionModel
      .findById(id)
      .populate({ path: 'exam', select: 'title examCode questions' }) // Populate exam details
      .lean()
      .exec()
  }

  async update(
    id: string,
    data: FinalSubmissionData,
  ): Promise<SubmissionDocument | null> {
    return await this.submissionModel
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec()
  }

  async findAll(
    query: FilterQuery<SubmissionDocument>,
  ): Promise<SubmissionDocument[]> {
    return await this.submissionModel
      .find(query)
      .populate({ path: 'user', select: 'fullName email' }) // Ví dụ populate user
      .populate({ path: 'exam', select: 'title examCode' }) // Ví dụ populate exam
      .sort({ createdAt: -1 })
      .lean() // Sắp xếp theo ngày tạo mới nhất
      .exec()
  }
}
