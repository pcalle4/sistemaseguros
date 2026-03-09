import { Module } from '@nestjs/common';
import { GetPolicyUseCase } from './application/use-cases/get-policy.usecase';
import { IssuePolicyUseCase } from './application/use-cases/issue-policy.usecase';
import { loadEnvConfig, ENV_CONFIG } from './config/env';
import { CLOCK } from './domain/ports/clock';
import { POLICIES_REPOSITORY } from './domain/ports/policies.repository';
import { QUOTE_READ_CLIENT } from './domain/ports/quote-read.client';
import { UUID_GENERATOR } from './domain/ports/uuid.generator';
import { SystemClock } from './infrastructure/adapters/clock/system.clock';
import { UuidGeneratorAdapter } from './infrastructure/adapters/uuid/uuid.generator';
import { HttpQuoteReadClient } from './infrastructure/clients/http-quote-read.client';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PrismaPoliciesRepository } from './infrastructure/repositories/prisma-policies.repository';
import { HealthController } from './presentation/controllers/health.controller';
import { PoliciesController } from './presentation/controllers/policies.controller';
import { AppLogger } from './shared/logging/logger';
import { FetchHttpClient, HTTP_CLIENT } from './shared/http/http-client';
import { RequestLoggingInterceptor } from './shared/logging/request-logging.interceptor';

@Module({
  imports: [PrismaModule],
  controllers: [PoliciesController, HealthController],
  providers: [
    AppLogger,
    RequestLoggingInterceptor,
    IssuePolicyUseCase,
    GetPolicyUseCase,
    {
      provide: ENV_CONFIG,
      useFactory: loadEnvConfig,
    },
    {
      provide: HTTP_CLIENT,
      useClass: FetchHttpClient,
    },
    {
      provide: POLICIES_REPOSITORY,
      useClass: PrismaPoliciesRepository,
    },
    {
      provide: QUOTE_READ_CLIENT,
      useClass: HttpQuoteReadClient,
    },
    {
      provide: UUID_GENERATOR,
      useClass: UuidGeneratorAdapter,
    },
    {
      provide: CLOCK,
      useClass: SystemClock,
    },
  ],
})
export class AppModule {}
