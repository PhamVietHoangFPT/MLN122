export interface Subject {
  data: [{ _id: string; subjectName: string }]
  message: string
  success: boolean
  statusCode: number
}

export interface SubjectInput {
  subjectName: string
}
