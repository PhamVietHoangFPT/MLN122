// src/submissions/interfaces/isubmission.service.ts

import { SubmitExamDto } from '../dto/submitExam.dto'
import { ExamForStudentDto } from 'src/module/exam/dto/examForStudent.dto'
import { SubmissionResponseDto } from '../dto/submissionResponse.dto'

/**
 * DTO trả về khi người dùng bắt đầu làm bài.
 * Chứa ID của lượt làm bài và nội dung đề thi.
 */
class StartExamResponseDto {
  submissionId: string
  exam: ExamForStudentDto
}

export interface ISubmissionService {
  startExam(examId: string, userId: string): Promise<StartExamResponseDto>

  submitExam(
    submissionId: string,
    userId: string,
    submissionDto: SubmitExamDto,
  ): Promise<SubmissionResponseDto>

  getSubmissionResult(
    submissionId: string,
    userId: string,
  ): Promise<SubmissionResponseDto | null>

  cancelSubmission(
    submissionId: string,
    userId: string,
  ): Promise<{ message: string }>

  getAllSubmissions(userId: string): Promise<SubmissionResponseDto[]>
}

export const ISubmissionService = Symbol('ISubmissionService')
