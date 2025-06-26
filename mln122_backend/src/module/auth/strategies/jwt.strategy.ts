// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      // Yêu cầu strategy trích xuất token từ "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Không bỏ qua việc kiểm tra token hết hạn
      ignoreExpiration: false,

      // **Đây là phần quan trọng nhất: Cung cấp secret để Passport xác thực chữ ký của JWT**
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  /**
   * Phương thức này CHỈ được gọi sau khi token đã được xác thực thành công
   * (chữ ký hợp lệ và chưa hết hạn).
   * Passport sẽ tự động giải mã payload và truyền vào đây.
   * @param payload Payload đã được giải mã từ JWT
   * @returns Dữ liệu sẽ được gắn vào request.user
   */
  validate(payload: any) {
    // payload ở đây chính là payload bạn đã dùng để tạo token trong auth.service.ts
    // { sub: user._id, email: user.email, role: user.role }

    // Bạn có thể thêm logic kiểm tra user có tồn tại trong DB không nếu cần
    // const user = await this.userService.findById(payload.sub);
    // if (!user) { throw new UnauthorizedException(); }

    return { userId: payload.sub, email: payload.email }
  }
}
