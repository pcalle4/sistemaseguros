import { Injectable } from '@nestjs/common';

type RequestLog = {
  method: string;
  path: string;
  status: number;
  durationMs: number;
};

@Injectable()
export class AppLogger {
  logRequest(entry: RequestLog): void {
    console.log(
      JSON.stringify({
        level: 'info',
        service: 'quote-service',
        type: 'request',
        timestamp: new Date().toISOString(),
        ...entry,
      }),
    );
  }

  logInfo(message: string): void {
    console.log(
      JSON.stringify({
        level: 'info',
        service: 'quote-service',
        type: 'application',
        timestamp: new Date().toISOString(),
        message,
      }),
    );
  }
}
