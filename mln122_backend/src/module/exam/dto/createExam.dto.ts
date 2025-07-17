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
import { Type } from 'class-transformer'

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

// DTO chính để tạo Exam
export class CreateExamDto {
  @ApiProperty({ example: 'DE_KT_VATLY_01', required: true })
  @IsNotEmpty()
  @IsString()
  examCode: string

  @ApiProperty({ example: 'Đề kiểm tra 15 phút môn Vật Lý', required: true })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    example: 15,
    required: true,
    description: 'Thời gian làm bài (phút)',
  })
  @IsNumber()
  duration: number

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
}
