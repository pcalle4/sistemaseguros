import 'dotenv/config';
import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadEnvConfig } from './config/env';
import { configureHttpApp } from './presentation/bootstrap/http-app.bootstrap';
import { AppLogger } from './shared/logging/logger';

async function bootstrap() {
  const env = loadEnvConfig();
  const app = await NestFactory.create(AppModule);
  configureHttpApp(app);
  await app.listen(env.port);

  app.get(AppLogger).logInfo(`API Gateway running on http://localhost:${env.port}`);
  Logger.log(`API Gateway running on http://localhost:${env.port}`, 'Bootstrap');
}

bootstrap();
