import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ProxyCatalogsUseCase } from './application/use-cases/proxy-catalogs.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';
import { ProxyPoliciesUseCase } from './application/use-cases/proxy-policies.usecase';
import { ProxyQuotesUseCase } from './application/use-cases/proxy-quotes.usecase';
import { ENV_CONFIG, loadEnvConfig } from './config/env';
import { AUTH_TOKEN_SERVICE } from './domain/ports/auth-token.service';
import { CREDENTIALS_VALIDATOR } from './domain/ports/credentials.validator';
import { UPSTREAM_GATEWAY_CLIENT } from './domain/ports/upstream-gateway.client';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtTokenService } from './infrastructure/auth/jwt-token.service';
import { MockCredentialsValidator } from './infrastructure/auth/mock-credentials.validator';
import { HttpUpstreamGatewayClient } from './infrastructure/clients/http-upstream-gateway.client';
import { AuthController } from './presentation/controllers/auth.controller';
import { CatalogsController } from './presentation/controllers/catalogs.controller';
import { HealthController } from './presentation/controllers/health.controller';
import { PoliciesController } from './presentation/controllers/policies.controller';
import { QuotesController } from './presentation/controllers/quotes.controller';
import { HTTP_CLIENT, FetchHttpClient } from './shared/http/http-client';
import { AppLogger } from './shared/logging/logger';
import { RequestLoggingInterceptor } from './shared/logging/request-logging.interceptor';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        const env = loadEnvConfig();

        return {
          secret: env.jwtSecret,
          signOptions: {
            expiresIn: env.jwtExpiresIn as never,
          },
        };
      },
    }),
  ],
  controllers: [AuthController, CatalogsController, QuotesController, PoliciesController, HealthController],
  providers: [
    {
      provide: ENV_CONFIG,
      useFactory: loadEnvConfig,
    },
    AppLogger,
    RequestLoggingInterceptor,
    LoginUseCase,
    ProxyCatalogsUseCase,
    ProxyQuotesUseCase,
    ProxyPoliciesUseCase,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: HTTP_CLIENT,
      useClass: FetchHttpClient,
    },
    {
      provide: AUTH_TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: CREDENTIALS_VALIDATOR,
      useClass: MockCredentialsValidator,
    },
    {
      provide: UPSTREAM_GATEWAY_CLIENT,
      useClass: HttpUpstreamGatewayClient,
    },
  ],
})
export class AppModule {}
