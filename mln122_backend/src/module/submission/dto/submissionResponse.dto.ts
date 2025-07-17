/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import mongoose from 'mongoose'
@Exclude()
class AnswerResponseDto {
  @Expose()
  @ApiProperty({ example: 'A' })
  answerCode: string

  @Expose()
  @ApiProperty({ example: 'Đây là đáp án A' })
  answerText: string
}

// DTO con cho Question trong response
@Exclude()
class QuestionResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  questionNo: number

  @Expose()
  @ApiProperty({ example: 'Nước Việt Nam có bao nhiêu tỉnh thành?' })
  title: string

  @Expose()
  @ApiProperty({ example: 'C' })
  correctAnswerCode: string

  @Expose()
  @ApiProperty({ type: [AnswerResponseDto] })
  @Type(() => AnswerResponseDto)
  answers: AnswerResponseDto[]
}
// DTO con cho mỗi câu trả lời trong lịch sử
@Exclude()
class UserAnswerResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'Số thứ tự câu hỏi' })
  questionNo: number

  @Expose()
  @ApiProperty({ example: 'C', description: 'Đáp án người dùng đã chọn' })
  chosenAnswerCode: string

  @Expose()
  @ApiProperty({ example: true, description: 'Câu trả lời này đúng hay sai' })
  isCorrect: boolean
}

// DTO con cho User
@Exclude()
class UserInSubmissionResponseDto {
  @Expose()
  @ApiProperty({ example: '685d56ebf5ad8e3ab2760466', type: String })
  @Transform(({ obj }) => obj._id.toString(), { toPlainOnly: true }) // SỬA Ở ĐÂY
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'hoangpvse183123@fpt.edu.vn' })
  email: string

  @Expose()
  @ApiProperty({ example: 'Pham Viet Hoang (K18 HCM)' })
  fullName: string
}

// DTO con, tối giản cho thông tin bài thi đi kèm
@Exclude()
class ExamInSubmissionResponseDto {
  @Expose()
  @ApiProperty({ example: '6878548f92dc913dd03b9e8c', type: String })
  @Transform(({ obj }) => obj._id.toString(), { toPlainOnly: true }) // SỬA Ở ĐÂY
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'Đề kiểm tra 15 phút môn Vật Lý' })
  title: string

  @Expose()
  @ApiProperty({ example: 'DE_KT_VATLY_01' })
  examCode: string

  @Expose()
  @ApiProperty({ type: [QuestionResponseDto] })
  questions: QuestionResponseDto[]
}

// DTO Response chính cho một lượt nộp bài
@Exclude()
export class SubmissionResponseDto {
  @Expose()
  @ApiProperty({ example: '68787985b160bfa8837e3463', type: String })
  @Transform(({ obj }) => obj._id.toString(), { toPlainOnly: true }) // SỬA Ở ĐÂY
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 8.5, description: 'Điểm số cuối cùng' })
  score: number

  @Expose()
  @ApiProperty({ description: 'Thời gian bắt đầu làm bài' })
  startedAt: Date

  @Expose()
  @ApiProperty({ description: 'Thời gian nộp bài' })
  finishedAt: Date

  @Expose()
  @ApiProperty({
    type: UserInSubmissionResponseDto,
    description: 'Thông tin người dùng đã nộp bài',
  })
  @Type(() => UserInSubmissionResponseDto)
  user: UserInSubmissionResponseDto

  @Expose()
  @ApiProperty({
    type: ExamInSubmissionResponseDto,
    description: 'Thông tin bài thi đã làm',
  })
  @Type(() => ExamInSubmissionResponseDto)
  exam: ExamInSubmissionResponseDto

  @Expose()
  @ApiProperty({
    type: [UserAnswerResponseDto],
    description: 'Chi tiết các câu trả lời',
  })
  @Type(() => UserAnswerResponseDto)
  answers: UserAnswerResponseDto[]

  @Expose()
  @ApiProperty({ description: 'Thời gian tạo kết quả' })
  createdAt: Date

  @Expose()
  @ApiProperty({ description: 'Thời gian cập nhật' })
  updatedAt: Date

  @Expose()
  @ApiProperty({ example: 'completed' })
  status: string

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
