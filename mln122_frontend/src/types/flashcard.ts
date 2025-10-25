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

export interface Flashcard {
  duration: number
  _id: string
  title: ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any
  data: [
    {
      _id: string
      subject: { _id: string; subjectName: string }
      questions: Question[]
      description?: string
    },
  ]
  success: boolean
  message: string
  statusCode: number
}
