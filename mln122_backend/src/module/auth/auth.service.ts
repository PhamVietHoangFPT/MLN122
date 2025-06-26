// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../user/schemas/user.schema'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signInWithGoogle(googleUser: any) {
    if (!googleUser) {
      throw new Error('No user from google')
    }

    let user = await this.userModel.findOne({ email: googleUser.email })

    if (!user) {
      // Nếu user chưa tồn tại, tạo mới
      const newUser = new this.userModel({
        email: googleUser.email,
        fullName: googleUser.fullName,
      })
      user = await newUser.save()
    }

    // Tạo JWT token của ứng dụng
    const payload = {
      sub: user._id,
      email: user.email,
      fullName: user.fullName,
    }
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    })

    return { accessToken }
  }
}
