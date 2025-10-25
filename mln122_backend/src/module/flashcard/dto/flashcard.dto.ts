/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsArray,
  ValidateNested,
  IsOptional,
  ArrayMinSize,
} from 'class-validator'
import { Exclude, Expose, Transform, Type } from 'class-transformer'
import mongoose from 'mongoose'

// DTO cho mỗi câu trả lời
class AnswerDto {
  @ApiProperty({ example: 'A', required: true })
  @IsNotEmpty()
  @IsString()
  answerCode: string

  @ApiProperty({ example: 'Đây là đáp án A', required: true })
  @IsNotEmpty()
  @IsString()
  answerText: string
}

// DTO cho mỗi câu hỏi
class QuestionDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  questionNo: number

  @ApiProperty({
    example: 'Nước Việt Nam có bao nhiêu tỉnh thành?',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    example: 'C',
    required: true,
    description: 'Mã của đáp án đúng',
  })
  @IsNotEmpty()
  @IsString()
  correctAnswerCode: string

  @ApiProperty({ type: [AnswerDto], required: true })
  @IsArray()
  @ValidateNested({ each: true }) // Quan trọng: Validate từng object trong mảng
  @ArrayMinSize(2) // Mỗi câu hỏi phải có ít nhất 2 đáp án
  @Type(() => AnswerDto) // Quan trọng: Giúp class-validator biết class để validate
  answers: AnswerDto[]
}

// DTO chính để tạo Flashcard
export class CreateFlashcardDto {
  @ApiProperty({
    example: '6697d838965f79e886915392',
    required: true,
    description: 'ID của môn học (Subject)',
  })
  @IsMongoId()
  subject: string

  @ApiProperty({
    type: [QuestionDto],
    required: false,
    description: 'Danh sách các câu hỏi',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: QuestionDto[]

  @ApiProperty({
    example: 'Bộ flashcard về các khái niệm cơ bản trong Vật Lý',
    required: true,
  })
  @IsNotEmpty({ message: 'description không được để trống' })
  @IsString()
  description: string
}

export class FindFlashcardsQueryDto {
  @ApiProperty({
    description: 'Lọc đề thi theo ID của môn học',
    required: false,
    example: '6697d838965f79e886915392',
  })
  @IsNotEmpty({ message: 'subjectId không được để trống' })
  @IsMongoId({ message: 'subjectId phải là một MongoID hợp lệ' })
  subjectId: string
}

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

// DTO Response chính cho Flashcard
@Exclude()
export class FlashcardResponseDto {
  @Expose()
  @ApiProperty({ example: '6697d8c5965f79e886915395', type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

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

@Exclude()
export class MinimalFlashcardResponseDto {
  @Expose()
  @ApiProperty({ example: '6697d8c5965f79e886915395', type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ type: SubjectResponseDto })
  @Type(() => SubjectResponseDto) // Giúp class-transformer biết cách biến đổi object lồng nhau
  subject: SubjectResponseDto

  @Expose()
  @ApiProperty({ example: 'Bộ flashcard về các khái niệm cơ bản trong Vật Lý' })
  description: string

  constructor(partial: any) {
    Object.assign(this, partial)
  }
}
