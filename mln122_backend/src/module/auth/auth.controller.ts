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
import { ConfigService } from '@nestjs/config'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard sẽ tự động redirect tới trang đăng nhập Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL')
    try {
      const { accessToken } = await this.authService.signInWithGoogle(req.user)
      // Chuyển hướng về địa chỉ frontend ĐÚNG
      res.redirect(`${frontendUrl}/login-success?token=${accessToken}`)
    } catch (error) {
      let redirectUrl = `${frontendUrl}/login-error?error=UnknownError`

      if (error instanceof ForbiddenException) {
        const errorMessage = error.message
        const encodedMessage = encodeURIComponent(errorMessage)
        redirectUrl = `${frontendUrl}/login-error?error=${encodedMessage}`
      }
      // Chuyển hướng về địa chỉ frontend ĐÚNG với lỗi
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
