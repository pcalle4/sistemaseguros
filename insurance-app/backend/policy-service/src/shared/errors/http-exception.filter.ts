import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DomainException } from './domain-exceptions';
import { ProblemDetails, ProblemFieldError } from './problem-details';

type HttpExceptionPayload = {
  detail?: string;
  message?: string | string[];
  errors?: ProblemFieldError[];
};

function toStatusTitle(status: number): string {
  const rawTitle = HttpStatus[status];

  if (!rawTitle) {
    return 'Error';
  }

  return rawTitle
    .toString()
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<{ url: string }>();
    const response = ctx.getResponse<{ status: (code: number) => { json: (body: unknown) => void } }>();

    const traceId = randomUUID();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let detail = 'Internal server error';
    let errors: ProblemFieldError[] = [];

    if (exception instanceof DomainException) {
      status = exception.status;
      detail = exception.message;
      errors = exception.errors;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse() as HttpExceptionPayload | string;

      if (typeof payload === 'string') {
        detail = payload;
      } else {
        detail = payload.detail ?? payload.message?.toString() ?? exception.message;
        errors = payload.errors ?? [];
      }
    } else if (exception instanceof Error) {
      detail = exception.message;
    }

    const problem: ProblemDetails = {
      type: `https://httpstatuses.com/${status}`,
      title: toStatusTitle(status),
      status,
      detail,
      instance: request.url,
      errors,
      traceId,
    };

    response.status(status).json(problem);
  }
}
