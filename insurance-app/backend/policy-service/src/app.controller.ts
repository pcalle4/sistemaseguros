import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  getHealth() {
    return {
      service: 'policy-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
