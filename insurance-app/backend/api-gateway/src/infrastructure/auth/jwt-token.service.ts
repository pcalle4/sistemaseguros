import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload, AuthTokenService } from '../../domain/ports/auth-token.service';

@Injectable()
export class JwtTokenService implements AuthTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: AuthTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
