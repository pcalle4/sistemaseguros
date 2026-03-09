import { Inject, Injectable } from '@nestjs/common';
import { ENV_CONFIG, EnvConfig } from '../../config/env';
import {
  AuthenticatedUser,
  CredentialsValidator,
} from '../../domain/ports/credentials.validator';

@Injectable()
export class MockCredentialsValidator implements CredentialsValidator {
  constructor(
    @Inject(ENV_CONFIG)
    private readonly env: EnvConfig,
  ) {}

  async validate(email: string, password: string): Promise<AuthenticatedUser | null> {
    if (email !== this.env.mockAuthEmail || password !== this.env.mockAuthPassword) {
      return null;
    }

    return {
      id: 'mock-user',
      email,
    };
  }
}
