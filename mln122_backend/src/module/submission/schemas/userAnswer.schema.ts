import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class UserAnswer {
  @Prop({ type: Number, required: true })
  questionNo: number

  @Prop({ type: String, required: true })
  chosenAnswerCode: string

  @Prop({ type: Boolean, required: true })
  isCorrect: boolean
}

export const UserAnswerSchema = SchemaFactory.createForClass(UserAnswer)
