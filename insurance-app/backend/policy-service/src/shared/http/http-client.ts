import { Injectable } from '@nestjs/common';

export type HttpResponse = {
  status: number;
  body: string;
};

export interface HttpClient {
  get(url: string): Promise<HttpResponse>;
}

export const HTTP_CLIENT = 'HTTP_CLIENT';

@Injectable()
export class FetchHttpClient implements HttpClient {
  async get(url: string): Promise<HttpResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      return {
        status: response.status,
        body: await response.text(),
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
