import { Inject, Injectable } from '@nestjs/common';
import { CreateQuoteDto } from '../dtos/create-quote.dto';
import { QuoteResponseDto } from '../dtos/quote-response.dto';
import {
  UPSTREAM_GATEWAY_CLIENT,
  UpstreamGatewayClient,
} from '../../domain/ports/upstream-gateway.client';
import { normalizeUpstreamError } from '../../shared/errors/normalize-upstream-error';

@Injectable()
export class ProxyQuotesUseCase {
  constructor(
    @Inject(UPSTREAM_GATEWAY_CLIENT)
    private readonly upstreamGatewayClient: UpstreamGatewayClient,
  ) {}

  async create(input: CreateQuoteDto): Promise<QuoteResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.post<QuoteResponseDto>({
        service: 'quote-service',
        path: '/quotes',
        body: input,
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }

  async getById(id: string): Promise<QuoteResponseDto> {
    try {
      const response = await this.upstreamGatewayClient.get<QuoteResponseDto>({
        service: 'quote-service',
        path: `/quotes/${id}`,
      });

      return response.data;
    } catch (error) {
      normalizeUpstreamError(error);
    }
  }
}
