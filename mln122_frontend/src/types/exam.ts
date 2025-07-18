import type { Subject } from './subject'

interface Answers {
  answerCode: string
  answerText: string
}

export interface Question {
  questionNo: number
  title: string
  answers: Answers[]
}

export interface Exam {
  data: [
    {
      _id: string
      examCode: string
      title: string
      duration: number // Thời gian làm bài (tính bằng phút)
      subject: Subject
      questions?: Question[]
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
