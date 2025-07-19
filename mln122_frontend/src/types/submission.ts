import type { valueType } from 'antd/es/statistic/utils'
import type { Exam } from './exam'
import type { Question } from './exam'

interface Answers {
  questionNo: number
  chosenAnswerCode: string
  isCorrect?: boolean
}

export interface Submission {
  data: [
    {
      score: valueType | undefined
      submissionId: string
      user: string
      exam: Exam
      questions?: Question[]
      answers?: Answers[]
      status: 'in-progress' | 'completed' | 'cancelled'
      createdAt?: Date
      updatedAt?: Date
      finishedAt?: Date
      startedAt?: Date
    },
  ]
  message: string
  success: boolean
  responseCode: number
}

export interface SubmissionInput {
  submissionId: string
  answers: Answers[]
}
