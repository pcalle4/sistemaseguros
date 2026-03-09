import { Inject, Injectable } from '@nestjs/common';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { AUTH_TOKEN_SERVICE, AuthTokenService } from '../../domain/ports/auth-token.service';
import {
  CREDENTIALS_VALIDATOR,
  CredentialsValidator,
} from '../../domain/ports/credentials.validator';
import { UnauthorizedDomainException } from '../../shared/errors/domain-exceptions';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(CREDENTIALS_VALIDATOR)
    private readonly credentialsValidator: CredentialsValidator,
    @Inject(AUTH_TOKEN_SERVICE)
    private readonly authTokenService: AuthTokenService,
  ) {}

  async execute(request: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.credentialsValidator.validate(request.email, request.password);

    if (!user) {
      throw new UnauthorizedDomainException('Invalid credentials');
    }

    return {
      accessToken: await this.authTokenService.sign({
        sub: user.id,
        email: user.email,
      }),
      tokenType: 'Bearer',
    };
  }
}
