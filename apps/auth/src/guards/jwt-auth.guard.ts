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
    return this.authService
      .verifyToken(token)
      .then((value) => {
        const args = context.getArgs();
        args[0] = value;
        return true;
      })
      .catch(() => false);
  }
}
