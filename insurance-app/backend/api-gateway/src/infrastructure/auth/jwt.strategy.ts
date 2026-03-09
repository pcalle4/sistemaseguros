import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ENV_CONFIG, EnvConfig } from '../../config/env';
import { UnauthorizedDomainException } from '../../shared/errors/domain-exceptions';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ENV_CONFIG)
    env: EnvConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwtSecret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedDomainException();
    }

    return {
      sub: payload.sub,
      email: payload.email,
    };
  }
}
