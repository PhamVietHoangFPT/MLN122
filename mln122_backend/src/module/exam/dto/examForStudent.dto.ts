/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type, Transform } from 'class-transformer'
import mongoose from 'mongoose'

// DTO con cho Answer (không thay đổi)
@Exclude()
class AnswerResponseDto {
  @Expose()
  @ApiProperty({ example: 'A' })
  answerCode: string

  @Expose()
  @ApiProperty({ example: 'Đây là đáp án A' })
  answerText: string
}

// DTO con cho Question (ĐÃ BỎ `correctAnswerCode`)
@Exclude()
class QuestionForStudentDto {
  @Expose()
  @ApiProperty({ example: 1 })
  questionNo: number

  @Expose()
  @ApiProperty({ example: 'Nước Việt Nam có bao nhiêu tỉnh thành?' })
  title: string

  @Expose()
  @ApiProperty({ type: [AnswerResponseDto] })
  @Type(() => AnswerResponseDto)
  answers: AnswerResponseDto[]
}

// DTO con tối giản cho Subject (không thay đổi)
@Exclude()
class SubjectResponseDto {
  @Expose()
  @ApiProperty({ example: '6697d838965f79e886915392', type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'Địa Lý' })
  subjectName: string
}

// DTO Response chính cho Exam (dành cho thí sinh)
@Exclude()
export class ExamForStudentDto {
  @Expose()
  @ApiProperty({ example: '6697d8c5965f79e886915395', type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'DE_KT_DIA_LY_01' })
  examCode: string

  @Expose()
  @ApiProperty({ example: 'Đề kiểm tra 15 phút môn Địa Lý' })
  title: string

  @Expose()
  @ApiProperty({ example: 15 })
  duration: number

  @Expose()
  @ApiProperty({ example: 'published' })
  status: string

  @Expose()
  @ApiProperty({ type: SubjectResponseDto })
  @Type(() => SubjectResponseDto)
  subject: SubjectResponseDto

  @Expose()
  @ApiProperty({ type: [QuestionForStudentDto] }) // <-- Sử dụng DTO Question đã được bảo mật
  @Type(() => QuestionForStudentDto)
  questions: QuestionForStudentDto[]

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
