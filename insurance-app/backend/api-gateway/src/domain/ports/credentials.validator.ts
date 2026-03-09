export type AuthenticatedUser = {
  id: string;
  email: string;
};

export interface CredentialsValidator {
  validate(email: string, password: string): Promise<AuthenticatedUser | null>;
}

export const CREDENTIALS_VALIDATOR = 'CREDENTIALS_VALIDATOR';
