import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedDomainException } from '../../shared/errors/domain-exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(error: unknown, user: TUser | false): TUser {
    if (error || !user) {
      throw new UnauthorizedDomainException();
    }

    return user;
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
