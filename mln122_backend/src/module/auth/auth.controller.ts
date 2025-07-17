// src/auth/auth.controller.ts
import {
  Controller,
  ForbiddenException,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RoleEnum } from 'src/common/enums/role.enum'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RolesGuard } from 'src/common/guard/roles.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard sẽ tự động redirect tới trang đăng nhập Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    try {
      // --- LUỒNG THÀNH CÔNG ---
      // Thử thực hiện đăng nhập
      const { accessToken } = await this.authService.signInWithGoogle(req.user)

      // Nếu thành công, chuyển hướng về trang success với token
      res.redirect(`http://localhost:5173/login-success?token=${accessToken}`)
    } catch (error) {
      // --- LUỒNG THẤT BẠI ---
      // Bắt lỗi nếu signInWithGoogle ném ra một Exception

      // Mặc định chuyển hướng về trang failure
      let redirectUrl = 'http://localhost:5173/login?error=UnknownError'

      if (error instanceof ForbiddenException) {
        // Nếu là lỗi do sai domain email mà chúng ta đã định nghĩa
        const errorMessage = error.message
        // Rất quan trọng: Mã hóa message để nó trở thành một phần hợp lệ của URL
        const encodedMessage = encodeURIComponent(errorMessage)
        redirectUrl = `http://localhost:5173/login?error=${encodedMessage}`
      }

      // Chuyển hướng về frontend với thông báo lỗi
      res.redirect(redirectUrl)
    }
  }

  @Get('test')
  @ApiBearerAuth()
  @Roles(RoleEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  testAuth(@Req() req) {
    // Đây là route chỉ cho phép người dùng đã đăng nhập qua JWT mới truy cập
    return { message: 'Bạn đã đăng nhập thành công!', user: req.user }
  }
}
