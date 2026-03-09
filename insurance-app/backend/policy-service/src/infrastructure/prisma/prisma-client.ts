import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@insurance/policy-prisma-client';

function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }

  return databaseUrl;
}

function getDatabaseSchema(databaseUrl: string): string | undefined {
  const schema = new URL(databaseUrl).searchParams.get('schema');

  return schema || undefined;
}

export function getPrismaClientOptions(): ConstructorParameters<typeof PrismaClient>[0] {
  const databaseUrl = getDatabaseUrl();

  return {
    adapter: new PrismaPg({ connectionString: databaseUrl }, { schema: getDatabaseSchema(databaseUrl) }),
  };
}

export function createPrismaClient(): PrismaClient {
  return new PrismaClient(getPrismaClientOptions());
}
