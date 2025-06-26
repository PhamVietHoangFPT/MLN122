import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { databaseConfig } from './config/database.config'
import { AuthModule } from './module/auth/auth.module'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    databaseConfig,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
