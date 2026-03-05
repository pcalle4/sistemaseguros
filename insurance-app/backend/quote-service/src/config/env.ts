export type EnvConfig = {
  port: number;
};

export function getEnvConfig(): EnvConfig {
  const rawPort = process.env.PORT ?? '3060';
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return { port };
}
