import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class UserAnswerPayloadDto {
  @ApiProperty({ example: 1, description: 'Số thứ tự của câu hỏi' })
  @IsNumber()
  questionNo: number

  @ApiProperty({ example: 'C', description: 'Mã đáp án mà người dùng đã chọn' })
  @IsString()
  chosenAnswerCode: string
}

export class SubmitExamDto {
  @ApiProperty({
    type: [UserAnswerPayloadDto],
    description: 'Mảng chứa các câu trả lời của người dùng',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserAnswerPayloadDto)
  answers: UserAnswerPayloadDto[]
}
