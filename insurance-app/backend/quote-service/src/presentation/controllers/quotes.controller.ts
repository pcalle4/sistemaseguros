import { Controller, Get, HttpCode, HttpException, Param, ParseUUIDPipe, Post, Body } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateQuoteDto } from '../../application/dtos/create-quote.dto';
import { QuoteResponseDto, toQuoteResponseDto } from '../../application/dtos/quote-response.dto';
import { CreateQuoteUseCase } from '../../application/use-cases/create-quote.usecase';
import { GetQuoteUseCase } from '../../application/use-cases/get-quote.usecase';
import { DomainException } from '../../shared/errors/domain-exceptions';
import { AppLogger } from '../../shared/logging/logger';

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly getQuoteUseCase: GetQuoteUseCase,
    private readonly logger: AppLogger,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create quote' })
  @ApiCreatedResponse({ type: QuoteResponseDto })
  async create(@Body() dto: CreateQuoteDto): Promise<QuoteResponseDto> {
    try {
      const quote = await this.createQuoteUseCase.execute(dto);
      this.logger.logRequest({ method: 'POST', path: '/quotes', status: 201 });
      return toQuoteResponseDto(quote);
    } catch (error) {
      this.logErrorStatus('POST', '/quotes', error);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get quote by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: QuoteResponseDto })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<QuoteResponseDto> {
    try {
      const quote = await this.getQuoteUseCase.execute(id);
      this.logger.logRequest({ method: 'GET', path: '/quotes/:id', status: 200 });
      return toQuoteResponseDto(quote);
    } catch (error) {
      this.logErrorStatus('GET', '/quotes/:id', error);
      throw error;
    }
  }

  private logErrorStatus(method: string, path: string, error: unknown): void {
    const status =
      error instanceof DomainException
        ? error.status
        : error instanceof HttpException
          ? error.getStatus()
          : 500;

    this.logger.logRequest({ method, path, status });
  }
}
