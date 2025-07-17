import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { BaseEntity } from 'src/common/schema/baseEntity.schema'
import { Question, QuestionSchema } from './question.schema'

export type ExamDocument = HydratedDocument<Exam>

@Schema({ versionKey: false })
export class Exam extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: String, required: true, unique: true, trim: true })
  examCode: string

  @Prop({ type: String, required: true, trim: true })
  title: string

  @Prop({ type: Number, required: true })
  duration: number // Thời gian làm bài, tính bằng phút

  // Tham chiếu tới collection Subject
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  })
  subject: mongoose.Schema.Types.ObjectId

  // Mảng các câu hỏi được nhúng trực tiếp
  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[]
}

export const ExamSchema = SchemaFactory.createForClass(Exam)
