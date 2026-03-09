import type { AuthSession } from '../entities/auth';

export interface AuthRepository {
  login(payload: { email: string; password: string }): Promise<AuthSession>;
}
