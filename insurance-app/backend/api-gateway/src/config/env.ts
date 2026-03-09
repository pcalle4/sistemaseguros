export type EnvConfig = {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  quoteServiceUrl: string;
  policyServiceUrl: string;
  mockAuthEmail: string;
  mockAuthPassword: string;
};

export const ENV_CONFIG = 'ENV_CONFIG';

function ensureHttpUrl(value: string, key: string): string {
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    throw new Error(`Invalid ${key} value`);
  }

  return value;
}

export function loadEnvConfig(): EnvConfig {
  const rawPort = process.env.PORT ?? '3050';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  const jwtSecret = process.env.JWT_SECRET ?? 'libelulasoft';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? '1h';
  const quoteServiceUrl = ensureHttpUrl(
    process.env.QUOTE_SERVICE_URL ?? 'http://localhost:3060',
    'QUOTE_SERVICE_URL',
  );
  const policyServiceUrl = ensureHttpUrl(
    process.env.POLICY_SERVICE_URL ?? 'http://localhost:3070',
    'POLICY_SERVICE_URL',
  );

  return {
    port,
    jwtSecret,
    jwtExpiresIn,
    quoteServiceUrl,
    policyServiceUrl,
    mockAuthEmail: process.env.MOCK_AUTH_EMAIL ?? 'user@example.com',
    mockAuthPassword: process.env.MOCK_AUTH_PASSWORD ?? 'password',
  };
}
