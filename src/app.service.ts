import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): { name: string; status: string } {
    return { name: 'ad-ecom project', status: 'ok' };
  }
}
