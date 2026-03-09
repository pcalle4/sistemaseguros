import { Inject, Injectable } from '@nestjs/common';
import { ENV_CONFIG, EnvConfig } from '../../config/env';
import {
  UpstreamGatewayClient,
  UpstreamRequestOptions,
  UpstreamResult,
  UpstreamService,
} from '../../domain/ports/upstream-gateway.client';
import { BadGatewayDomainException, UpstreamProblemDomainException } from '../../shared/errors/domain-exceptions';
import { HTTP_CLIENT, HttpClient, HttpResponse } from '../../shared/http/http-client';
import { ProblemFieldErrorItem } from '../../shared/errors/problem-details';

type ProblemLike = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: ProblemFieldErrorItem[];
  message?: string | string[];
};

@Injectable()
export class HttpUpstreamGatewayClient implements UpstreamGatewayClient {
  constructor(
    @Inject(ENV_CONFIG)
    private readonly env: EnvConfig,
    @Inject(HTTP_CLIENT)
    private readonly httpClient: HttpClient,
  ) {}

  get<T>(request: UpstreamRequestOptions): Promise<UpstreamResult<T>> {
    return this.request<T>('GET', request);
  }

  post<T>(request: UpstreamRequestOptions): Promise<UpstreamResult<T>> {
    return this.request<T>('POST', request);
  }

  private async request<T>(
    method: 'GET' | 'POST',
    request: UpstreamRequestOptions,
  ): Promise<UpstreamResult<T>> {
    const url = this.buildUrl(request.service, request.path, request.query);

    try {
      const response = await this.httpClient.request({
        method,
        url,
        body: request.body,
        headers: request.headers,
        timeoutMs: 5000,
      });

      if (response.status >= 200 && response.status < 300) {
        return {
          status: response.status,
          data: this.parseSuccessPayload<T>(response),
        };
      }

      throw this.toUpstreamException(response);
    } catch (error) {
      if (error instanceof UpstreamProblemDomainException || error instanceof BadGatewayDomainException) {
        throw error;
      }

      throw new BadGatewayDomainException();
    }
  }

  private buildUrl(
    service: UpstreamService,
    path: string,
    query?: Record<string, string | undefined>,
  ): string {
    const baseUrl = service === 'quote-service' ? this.env.quoteServiceUrl : this.env.policyServiceUrl;
    const url = new URL(path, `${baseUrl}/`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, value);
        }
      }
    }

    return url.toString();
  }

  private parseSuccessPayload<T>(response: HttpResponse): T {
    if (!response.body) {
      return undefined as T;
    }

    return JSON.parse(response.body) as T;
  }

  private toUpstreamException(response: HttpResponse): UpstreamProblemDomainException {
    const payload = this.safeParseBody(response.body);

    if (payload !== null && this.isProblemDetails(payload)) {
      return new UpstreamProblemDomainException({
        status: payload.status ?? response.status,
        detail: payload.detail ?? this.toDetail(payload.message, 'Upstream request failed'),
        errors: payload.errors ?? [],
        title: payload.title,
        type: payload.type,
      });
    }

    return new UpstreamProblemDomainException({
      status: response.status,
      detail: this.toDetail(payload?.message ?? response.body, 'Upstream request failed'),
    });
  }

  private safeParseBody(body: string): ProblemLike | null {
    if (!body) {
      return null;
    }

    try {
      return JSON.parse(body) as ProblemLike;
    } catch {
      return null;
    }
  }

  private isProblemDetails(payload: ProblemLike): boolean {
    return Boolean(typeof payload === 'object' && (payload.detail || payload.title || payload.type));
  }

  private toDetail(message: string | string[] | undefined, fallback: string): string {
    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string' && message.trim().length > 0) {
      return message;
    }

    return fallback;
  }
}
