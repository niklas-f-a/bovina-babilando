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
    const { access_token } = context?.getArgs()[0];

    if (!access_token) return false;

    return this.authService
      .verifyToken(access_token)
      .then((value) => {
        const args = context.getArgs();
        args[0] = value;
        return true;
      })
      .catch((error) => {
        const args = context.getArgs();
        args[0] = error;
        return error;
      });
  }
}
