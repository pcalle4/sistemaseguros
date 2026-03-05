import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getEnvConfig } from './config/env';
import { AppModule } from './app.module';
import { configureHttpApp } from './presentation/bootstrap/http-app.bootstrap';
import { AppLogger } from './shared/logging/logger';

async function bootstrap(): Promise<void> {
  const env = getEnvConfig();
  const app = await NestFactory.create(AppModule);

  configureHttpApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Insurance Quote Service')
    .setDescription('Quote microservice for insurance platform')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(env.port);

  const logger = app.get(AppLogger);
  logger.logInfo(`Quote Service running on http://localhost:${env.port}`);
}

bootstrap();
