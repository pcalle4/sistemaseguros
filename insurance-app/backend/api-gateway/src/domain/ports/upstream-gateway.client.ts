export type UpstreamService = 'quote-service' | 'policy-service';

export type UpstreamRequestOptions = {
  service: UpstreamService;
  path: string;
  query?: Record<string, string | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
};

export type UpstreamResult<T> = {
  status: number;
  data: T;
};

export interface UpstreamGatewayClient {
  get<T>(request: UpstreamRequestOptions): Promise<UpstreamResult<T>>;
  post<T>(request: UpstreamRequestOptions): Promise<UpstreamResult<T>>;
}

export const UPSTREAM_GATEWAY_CLIENT = 'UPSTREAM_GATEWAY_CLIENT';
