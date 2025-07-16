import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'
export class CreateSubjectDto {
  @ApiProperty({ example: 'Hóa', required: true })
  @IsNotEmpty({ message: 'Tên môn học không được để trống' })
  @IsString({ message: 'Tên môn học phải là một chuỗi' })
  subjectName: string
}
