// src/main.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { join } from 'node:path'
import { JwtExceptionFilter } from './common/filters/jwt-exception.filter'
// import * as dotenv from 'dotenv'; // Dòng này không cần thiết vì ConfigModule đã xử lý

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const configService = app.get(ConfigService)

  // --- Bắt đầu cấu hình ứng dụng ---

  // 1. Bật CORS
  app.enableCors()

  // 2. Đặt tiền tố toàn cục cho TẤT CẢ các API
  // Đây là dòng quan trọng nhất để sửa lỗi 404
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new JwtExceptionFilter())
  // 3. Bật Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  // 4. Cấu hình phục vụ file tĩnh
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  })

  // --- Bắt đầu cấu hình Swagger ---
  const config = new DocumentBuilder()
    .setTitle('MLN STUDY SYSTEM')
    .setDescription('STUDY SYSTEM')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)
  // Đường dẫn của Swagger sẽ là /api/docs (vì đã có global prefix 'api')
  SwaggerModule.setup('docs', app, document)

  // --- Kết thúc cấu hình ---

  const port = configService.get<number>('PORT') || 5000 // Nên khớp với port bạn đang dùng
  await app.listen(port, () => {
    console.log(`Application is running on: http://localhost:${port}`)
    // URL Swagger mới sẽ là http://localhost:5000/api/docs
    console.log(`Swagger UI available at http://localhost:${port}/api/docs`)
  })
}

// Gọi hàm bootstrap để chạy ứng dụng
void bootstrap()
