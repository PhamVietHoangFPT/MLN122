import { PartialType } from '@nestjs/swagger'
import { CreateExamDto } from './createExam.dto'

// Kế thừa từ CreateExamDto và tự động làm tất cả các trường thành optional
export class UpdateExamDto extends PartialType(CreateExamDto) {}
