import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { BaseEntity } from 'src/common/schema/baseEntity.schema'
import {
  Question,
  QuestionSchema,
} from 'src/module/exam/schemas/question.schema'

export type FlashcardDocument = HydratedDocument<Flashcard>

@Schema({ versionKey: false })
export class Flashcard extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Schema.Types.ObjectId

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

  @Prop({ type: String })
  description: string
}

export const FlashcardSchema = SchemaFactory.createForClass(Flashcard)
