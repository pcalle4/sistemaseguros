import type { AxiosInstance } from 'axios';
import { apiRoutes } from '../../core/constants/routes';
import type { LoginApiRequest, LoginApiResponse } from '../../core/types/api';
import type { AuthSession } from '../../domain/entities/auth';
import type { AuthRepository } from '../../domain/repositories/auth.repository';

export class AuthApiRepository implements AuthRepository {
  constructor(private readonly client: AxiosInstance) {}

  async login(payload: LoginApiRequest): Promise<AuthSession> {
    const response = await this.client.post<LoginApiResponse>(apiRoutes.login, payload);

    return {
      accessToken: response.data.accessToken,
      tokenType: response.data.tokenType,
      email: payload.email,
    };
  }
}
