import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppLogger } from './logger';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string; originalUrl?: string; url: string }>();
    const response = context.switchToHttp().getResponse<{
      statusCode: number;
      once: (event: 'finish', listener: () => void) => void;
    }>();
    const startedAt = Date.now();

    response.once('finish', () => {
      this.logger.logRequest({
        method: request.method,
        path: request.originalUrl ?? request.url,
        status: response.statusCode,
        durationMs: Date.now() - startedAt,
      });
    });

    return next.handle();
  }
}
