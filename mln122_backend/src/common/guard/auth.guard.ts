// src/common/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Guard này sẽ tự động sử dụng JwtStrategy mà chúng ta đã định nghĩa ở trên
  // vì chúng ta đã đặt tên cho nó là 'jwt' (tham số thứ hai trong PassportStrategy).
  // Tất cả logic phức tạp (trích xuất token, xác thực) đã được Passport xử lý.
  // Class này có thể để trống hoàn toàn!
}
