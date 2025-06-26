import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Tôi yêu kinh tế chính trị Marx Lenin!'
  }
}
