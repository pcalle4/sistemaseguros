import { BadRequestException, INestApplication, ValidationError, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../shared/errors/http-exception.filter';
import { AppLogger } from '../../shared/logging/logger';
import { RequestLoggingInterceptor } from '../../shared/logging/request-logging.interceptor';

function flattenValidationErrors(
  validationErrors: ValidationError[],
  parentPath?: string,
): { field: string; message: string }[] {
  const output: { field: string; message: string }[] = [];

  for (const error of validationErrors) {
    const field = parentPath ? `${parentPath}.${error.property}` : error.property;

    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        output.push({ field, message });
      }
    }

    if (error.children && error.children.length > 0) {
      output.push(...flattenValidationErrors(error.children, field));
    }
  }

  return output;
}

export function configureHttpApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException({
          detail: 'Validation failed',
          errors: flattenValidationErrors(errors),
        });
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggingInterceptor(app.get(AppLogger)));
}
