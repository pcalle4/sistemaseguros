import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateQuoteDto } from '../../application/dtos/create-quote.dto';
import { QuoteResponseDto } from '../../application/dtos/quote-response.dto';
import { ProxyQuotesUseCase } from '../../application/use-cases/proxy-quotes.usecase';
import { ProblemDetails } from '../../shared/errors/problem-details';

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly proxyQuotesUseCase: ProxyQuotesUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a quote via quote-service' })
  @ApiCreatedResponse({ type: QuoteResponseDto })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  create(@Body() body: CreateQuoteDto): Promise<QuoteResponseDto> {
    return this.proxyQuotesUseCase.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a quote by id via quote-service' })
  @ApiOkResponse({ type: QuoteResponseDto })
  @ApiNotFoundResponse({ type: ProblemDetails })
  @ApiBadGatewayResponse({ type: ProblemDetails })
  getById(@Param('id') id: string): Promise<QuoteResponseDto> {
    return this.proxyQuotesUseCase.getById(id);
  }
}
