// src/auth/auth.service.ts
import {
  Injectable,
  ForbiddenException, // 1. Import ForbiddenException
  UnauthorizedException,
  Inject,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
// ... các import khác của bạn
import { GoogleProfileDto, LoginResponseDto } from './interfaces/iauth.service'
import { User, UserDocument } from '../user/schemas/user.schema'
import { IRoleRepository } from '../role/interfaces/irole.repository'

@Injectable()
export class AuthService {
  // Implement IAuthService
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @Inject(IRoleRepository) private roleModel: IRoleRepository,
    private jwtService: JwtService,
    // ... các dependency khác
  ) {}

  async signInWithGoogle(
    googleUser: GoogleProfileDto,
  ): Promise<LoginResponseDto> {
    if (!googleUser || !googleUser.email) {
      throw new UnauthorizedException(
        'Không nhận được thông tin người dùng từ Google.',
      )
    }

    // --- BƯỚC VALIDATE EMAIL ---
    const requiredDomain = '@fpt.edu.vn'
    if (!googleUser.email.toLowerCase().endsWith(requiredDomain)) {
      // Nếu email không đúng domain, ném ra lỗi và dừng toàn bộ quá trình
      throw new ForbiddenException(
        `Truy cập bị từ chối. Chỉ những tài khoản có email FPT (${requiredDomain}) mới được phép sử dụng hệ thống.`,
      )
    }
    // --- KẾT THÚC VALIDATE EMAIL ---

    // Nếu email hợp lệ, tiếp tục logic như cũ...
    let user = await this.userModel.findOne({ email: googleUser.email })

    if (!user) {
      // Logic tìm role 'student' và tạo người dùng mới của bạn ở đây
      const studentRole = await this.roleModel.getRoleIdByName('student')
      if (!studentRole) {
        throw new Error('Không tìm thấy vai trò "student" trong hệ thống.')
      }

      const newUser = new this.userModel({
        email: googleUser.email,
        fullName: googleUser.fullName,
        picture: googleUser.picture,
        role: studentRole,
      })
      user = await newUser.save()
    }

    // Logic tạo JWT và trả về token của bạn ở đây...
    // ...
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      picture: user.picture,
    }
    const accessToken = this.jwtService.sign(payload)
    return { accessToken }
  }

  // ... các phương thức khác của service
}
