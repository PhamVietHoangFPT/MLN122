/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Type, Transform } from 'class-transformer'
import mongoose from 'mongoose'

// DTO con cho Answer trong response
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

// DTO con tối giản cho Subject trong response
@Exclude()
class SubjectResponseDto {
  @Expose()
  @ApiProperty({ example: '6697d838965f79e886915392', type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'Vật Lý' })
  subjectName: string
}

// DTO Response chính cho Exam
@Exclude()
export class ExamResponseDto {
  @Expose()
  @ApiProperty({ example: '6697d8c5965f79e886915395', type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'DE_KT_VATLY_01' })
  examCode: string

  @Expose()
  @ApiProperty({ example: 'Đề kiểm tra 15 phút môn Vật Lý' })
  title: string

  @Expose()
  @ApiProperty({ example: 15 })
  duration: number

  @Expose()
  @ApiProperty({ type: SubjectResponseDto })
  @Type(() => SubjectResponseDto) // Giúp class-transformer biết cách biến đổi object lồng nhau
  subject: SubjectResponseDto

  @Expose()
  @ApiProperty({ type: [QuestionResponseDto] })
  @Type(() => QuestionResponseDto)
  questions: QuestionResponseDto[]

  // Constructor để nhận dữ liệu từ Mongoose (đặc biệt là kết quả từ aggregate)
  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
