import { ApiProperty } from '@nestjs/swagger'
import { IsMongoId, IsOptional } from 'class-validator'

export class FindExamsQueryDto {
  @ApiProperty({
    description: 'Lọc đề thi theo ID của môn học',
    required: false,
    example: '6697d838965f79e886915392',
  })
  @IsOptional() // Cho phép không cần truyền
  @IsMongoId({ message: 'subjectId phải là một MongoID hợp lệ' })
  subjectId?: string
}
