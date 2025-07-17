import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Answer, AnswerSchema } from './answer.schema'

@Schema({ _id: false })
export class Question {
  @Prop({ type: Number, required: true })
  questionNo: number

  @Prop({ type: String, required: true, trim: true })
  title: string

  @Prop({ type: String, required: true, trim: true })
  correctAnswerCode: string

  @Prop({ type: [AnswerSchema], required: true })
  answers: Answer[]
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
