import { ServiceTokens } from '@app/shared/config';
import { ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(ServiceTokens.AUTH) private authService: AuthService) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = context.getArgs()[0]?.access_token;
    const isVerified = this.authService
      .verifyToken(token)
      .then(() => true)
      .catch(() => false);

    return isVerified;
  }
}
