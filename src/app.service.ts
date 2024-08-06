import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      status: 'success',
      statusCode: 200,
      message: 'API iDEE V2',
      data: [],
    };
  }
}
