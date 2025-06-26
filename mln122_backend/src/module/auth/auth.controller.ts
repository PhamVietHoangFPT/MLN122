// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { Response } from 'express'
import { ApiBearerAuth } from '@nestjs/swagger'
import { RoleEnum } from 'src/common/enums/role.enum'
import { Roles } from 'src/common/decorators/roles.decorator'
import { RolesGuard } from 'src/common/guard/roles.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {
    // Guard sẽ tự động redirect tới trang đăng nhập Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { accessToken } = await this.authService.signInWithGoogle(req.user)

    // Tùy chọn 1: Redirect về frontend với token trong query param
    // Đây là cách phổ biến cho web application
    res.redirect(`http://localhost:5173/login-success?token=${accessToken}`)

    // Tùy chọn 2: Trả về JSON (nếu client là mobile app chẳng hạn)
    // return { accessToken };
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
