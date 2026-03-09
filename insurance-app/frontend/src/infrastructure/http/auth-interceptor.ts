import type { AxiosInstance } from 'axios';
import { useAuthStore } from '../../presentation/store/auth.store';

export function installAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const { accessToken, tokenType } = useAuthStore.getState();

    if (accessToken && tokenType) {
      config.headers.Authorization = `${tokenType} ${accessToken}`;
    }

    return config;
  });
}
