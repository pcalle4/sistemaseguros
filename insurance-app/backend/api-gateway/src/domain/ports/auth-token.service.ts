export type AuthTokenPayload = {
  sub: string;
  email: string;
};

export interface AuthTokenService {
  sign(payload: AuthTokenPayload): Promise<string>;
}

export const AUTH_TOKEN_SERVICE = 'AUTH_TOKEN_SERVICE';
