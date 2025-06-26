// src/user/schema/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { BaseEntity } from 'src/common/schema/baseEntity.schema'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User extends BaseEntity {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string

  // Xóa trường password

  @Prop({ type: String, required: true, trim: true })
  fullName: string
  // --- Gợi ý thêm các trường sau ---
  @Prop({ type: String, unique: true, sparse: true })
  // sparse: true cho phép nhiều document có giá trị null, nhưng giá trị không null phải là duy nhất.
  // Rất hữu ích cho các trường định danh từ bên thứ ba.
  googleId?: string

  @Prop({ type: String, required: false })
  picture?: string // Lưu URL ảnh đại diện từ Google
}

export const UserSchema = SchemaFactory.createForClass(User)
