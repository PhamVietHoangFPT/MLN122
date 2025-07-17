import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class Answer {
  @Prop({ type: String, required: true, trim: true })
  answerCode: string

  @Prop({ type: String, required: true, trim: true })
  answerText: string
}

export const AnswerSchema = SchemaFactory.createForClass(Answer)
