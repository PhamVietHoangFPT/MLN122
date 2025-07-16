/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ApiProperty } from '@nestjs/swagger'
import { Exclude, Expose, Transform } from 'class-transformer'
import mongoose from 'mongoose'
import { Subject } from '../schemas/subject.schema'

@Exclude()
export class SubjectResponseDto {
  @Expose()
  @ApiProperty({
    example: '669668822b3b6e4e83113c5c',
    type: String,
    description: 'ID của môn học',
  })
  @Transform(({ value }) => value?.toString(), { toPlainOnly: true })
  _id: mongoose.Schema.Types.ObjectId

  @Expose()
  @ApiProperty({ example: 'Lịch sử', description: 'Tên của môn học' })
  subjectName: string

  constructor(partial: Partial<Subject>) {
    Object.assign(this, partial)
  }
}
