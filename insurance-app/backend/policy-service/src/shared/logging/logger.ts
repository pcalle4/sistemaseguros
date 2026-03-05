import { Injectable } from '@nestjs/common';

type RequestLog = {
  method: string;
  path: string;
  status: number;
};

@Injectable()
export class AppLogger {
  logRequest(entry: RequestLog): void {
    console.log(
      JSON.stringify({
        level: 'info',
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
        type: 'application',
        timestamp: new Date().toISOString(),
        message,
      }),
    );
  }
}
