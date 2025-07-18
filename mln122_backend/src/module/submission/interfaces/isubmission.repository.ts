import { FilterQuery } from 'mongoose'
import { SubmissionDocument } from '../schemas/submission.schema'

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

export interface ISubmissionRepository {
  create(data: InitialSubmissionData): Promise<SubmissionDocument>
  findById(id: string): Promise<SubmissionDocument | null>
  update(
    id: string,
    data: FinalSubmissionData,
  ): Promise<SubmissionDocument | null>
  findAll(query: FilterQuery<SubmissionDocument>): Promise<SubmissionDocument[]>
  getExamIdBySubmissionId(submissionId: string): Promise<string | null>
  cancelSubmission(
    submissionId: string,
    data: any,
  ): Promise<SubmissionDocument | null>
}

export const ISubmissionRepository = Symbol('ISubmissionRepository')
