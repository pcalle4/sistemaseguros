import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      service: 'api-gateway',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
