import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto } from '../../application/dtos/login-request.dto';
import { LoginResponseDto } from '../../application/dtos/login-response.dto';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { ProblemDetails } from '../../shared/errors/problem-details';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate a mock user and get a JWT' })
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiUnauthorizedResponse({ type: ProblemDetails })
  login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(body);
  }
}
