import type { ReactNode } from 'react'

interface Answers {
  answerCode: string
  answerText: string
}

export interface Question {
  correctAnswerCode: string
  questionNo: number
  title: string
  answers: Answers[]
}

export interface Exam {
  duration: number
  _id: string
  title: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any
  data: [
    {
      _id: string
      examCode: string
      title: string
      duration: number // Thời gian làm bài (tính bằng phút)
      subject: { _id: string; subjectName: string }
      questions: Question[]
    },
  ]
  success: boolean
  message: string
  statusCode: number
}

export interface ExamInput {
  examCode: string
  title: string
  duration: number
  subject: string
  questions: Question[]
}
