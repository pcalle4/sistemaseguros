import axios, { type AxiosInstance } from 'axios';
import { env } from '../../core/config/env';
import { normalizeApiError } from '../../core/utils/error-mapper';
import { installAuthInterceptor } from './auth-interceptor';

function createAxiosClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  installAuthInterceptor(client);

  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(normalizeApiError(error)),
  );

  return client;
}

export const apiClient = createAxiosClient();
