import { BadGatewayDomainException, DomainException } from './domain-exceptions';

export function normalizeUpstreamError(error: unknown): never {
  if (error instanceof DomainException) {
    throw error;
  }

  throw new BadGatewayDomainException();
}
