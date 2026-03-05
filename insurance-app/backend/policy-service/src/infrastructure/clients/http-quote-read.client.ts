import { Inject, Injectable } from '@nestjs/common';
import { EnvConfig, ENV_CONFIG } from '../../config/env';
import { QuoteLookupResult, QuoteReadClient } from '../../domain/ports/quote-read.client';
import { BadGatewayDomainException } from '../../shared/errors/domain-exceptions';
import { HTTP_CLIENT, HttpClient } from '../../shared/http/http-client';

@Injectable()
export class HttpQuoteReadClient implements QuoteReadClient {
  constructor(
    @Inject(ENV_CONFIG)
    private readonly env: EnvConfig,
    @Inject(HTTP_CLIENT)
    private readonly httpClient: HttpClient,
  ) {}

  async getQuoteById(id: string): Promise<QuoteLookupResult> {
    const url = `${this.env.quoteServiceUrl}/quotes/${id}`;

    try {
      const response = await this.httpClient.get(url);

      if (response.status === 200) {
        return 'FOUND';
      }

      if (response.status === 404) {
        return 'NOT_FOUND';
      }

      throw new BadGatewayDomainException('Quote service unavailable');
    } catch (error) {
      if (error instanceof BadGatewayDomainException) {
        throw error;
      }

      throw new BadGatewayDomainException('Quote service unavailable');
    }
  }
}
