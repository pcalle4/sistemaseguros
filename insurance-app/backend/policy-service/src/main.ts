import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EnvConfig, ENV_CONFIG } from './config/env';
import { configureHttpApp } from './presentation/bootstrap/http-app.bootstrap';
import { AppLogger } from './shared/logging/logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  configureHttpApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Insurance Policy Service')
    .setDescription('Policy microservice for insurance platform')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const env = app.get<EnvConfig>(ENV_CONFIG);
  await app.listen(env.port);

  const logger = app.get(AppLogger);
  logger.logInfo(`Policy Service running on http://localhost:${env.port}`);
}

bootstrap();
