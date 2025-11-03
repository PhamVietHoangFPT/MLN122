import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'ĐẢNG CỘNG SẢN VIỆT NAM QUANG VINH MUÔN NĂM!'
  }
}
