export type EnvConfig = {
  port: number;
  quoteServiceUrl: string;
};

export const ENV_CONFIG = 'ENV_CONFIG';

export function loadEnvConfig(): EnvConfig {
  const rawPort = process.env.PORT ?? '3070';
  const quoteServiceUrl = process.env.QUOTE_SERVICE_URL ?? 'http://localhost:3060';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  if (!quoteServiceUrl.startsWith('http')) {
    throw new Error('Invalid QUOTE_SERVICE_URL value');
  }

  return {
    port,
    quoteServiceUrl,
  };
}
