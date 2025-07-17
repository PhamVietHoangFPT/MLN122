// src/submissions/schemas/submission.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { UserAnswer, UserAnswerSchema } from './userAnswer.schema'

export type SubmissionDocument = HydratedDocument<Submission>

@Schema({ timestamps: true, versionKey: false })
export class Submission {
  @Prop({ type: Number, required: false, min: 0, max: 10 })
  score: number

  @Prop({ type: Date, required: true })
  startedAt: Date

  @Prop({ type: Date, required: false })
  finishedAt: Date

  @Prop({
    type: String,
    required: true,
    enum: ['in-progress', 'completed', 'canceled', 'abandoned'], // Thêm các trạng thái mới
    default: 'in-progress',
  })
  status: string

  // Tham chiếu tới collection User
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: mongoose.Schema.Types.ObjectId

  // Tham chiếu tới collection Exam
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true })
  exam: mongoose.Schema.Types.ObjectId

  // Mảng lịch sử các câu trả lời được nhúng trực tiếp
  @Prop({ type: [UserAnswerSchema], default: [] })
  answers: UserAnswer[]
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission)
