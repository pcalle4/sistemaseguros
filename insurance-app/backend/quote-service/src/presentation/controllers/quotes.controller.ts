import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';
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

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
  constructor(
    private readonly createQuoteUseCase: CreateQuoteUseCase,
    private readonly getQuoteUseCase: GetQuoteUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create quote' })
  @ApiCreatedResponse({ type: QuoteResponseDto })
  async create(@Body() dto: CreateQuoteDto): Promise<QuoteResponseDto> {
    const quote = await this.createQuoteUseCase.execute(dto);
    return toQuoteResponseDto(quote);
  }

  @Get(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get quote by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({ type: QuoteResponseDto })
  @ApiNotFoundResponse({ description: 'Quote not found' })
  async getById(@Param('id', new ParseUUIDPipe()) id: string): Promise<QuoteResponseDto> {
    const quote = await this.getQuoteUseCase.execute(id);
    return toQuoteResponseDto(quote);
  }
}
