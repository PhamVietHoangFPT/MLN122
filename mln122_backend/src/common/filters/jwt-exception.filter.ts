// src/common/filters/jwt-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express' // Import Request

@Catch(UnauthorizedException)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()

    const errorResponse = exception.getResponse()
    let message = 'Bạn không có quyền truy cập.' // Tin nhắn mặc định
    let originalErrorMessage = ''

    // Trích xuất thông báo lỗi gốc, dù nó là object hay string
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      originalErrorMessage = (errorResponse as any).message || ''
    } else if (typeof errorResponse === 'string') {
      originalErrorMessage = errorResponse
    }

    // So sánh với chuỗi thông báo gốc để đưa ra thông báo tùy chỉnh
    if (originalErrorMessage.includes('jwt expired')) {
      message = 'Token đã hết hạn. Vui lòng đăng nhập lại.'
    } else if (
      originalErrorMessage.includes('invalid signature') ||
      originalErrorMessage.includes('jwt malformed') ||
      // Thêm trường hợp khi message gốc là 'Unauthorized' nhưng ta muốn thông báo rõ hơn
      originalErrorMessage.toLowerCase() === 'unauthorized'
    ) {
      // Vì không thể phân biệt 'sai signature' với các lỗi 'Unauthorized' khác,
      // chúng ta đưa ra một thông báo chung hơn cho trường hợp này.
      message = 'Token không hợp lệ, bị từ chối hoặc đã bị thay đổi.'
    }

    // Trả về response JSON với định dạng tùy chỉnh
    response.status(status).json({
      statusCode: status,
      message: message, // Sử dụng message đã được tùy chỉnh
    })
  }
}
