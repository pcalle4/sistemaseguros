import { Injectable } from '@nestjs/common';

export type HttpMethod = 'GET' | 'POST';

export type HttpRequest = {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
};

export type HttpResponse = {
  status: number;
  body: string;
  headers: Record<string, string>;
};

export interface HttpClient {
  request(request: HttpRequest): Promise<HttpResponse>;
}

export const HTTP_CLIENT = 'HTTP_CLIENT';

@Injectable()
export class FetchHttpClient implements HttpClient {
  async request(request: HttpRequest): Promise<HttpResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs ?? 5000);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(request.headers ?? {}),
    };

    const hasBody = request.body !== undefined;

    if (hasBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers,
        body: hasBody ? JSON.stringify(request.body) : undefined,
        signal: controller.signal,
      });

      return {
        status: response.status,
        body: await response.text(),
        headers: Object.fromEntries(response.headers.entries()),
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
