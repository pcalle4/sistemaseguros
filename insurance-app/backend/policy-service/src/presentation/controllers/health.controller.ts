import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

class HealthResponse {
  service!: string;
  status!: string;
  timestamp!: string;
}

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiOkResponse({ type: HealthResponse })
  getHealth(): HealthResponse {
    return {
      service: 'policy-service',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
