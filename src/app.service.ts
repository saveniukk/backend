import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkHealth() {
    return {
      status: 'ok',
      date: new Date().toISOString(),
    };
  }
}
