import type { AuthSession } from '../../domain/entities/auth';
import type { AuthRepository } from '../../domain/repositories/auth.repository';

export class LoginUseCase {
  constructor(private readonly repository: AuthRepository) {}

  execute(payload: { email: string; password: string }): Promise<AuthSession> {
    return this.repository.login(payload);
  }
}
