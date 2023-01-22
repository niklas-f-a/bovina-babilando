import { ServiceTokens } from '@app/shared/config';
import { ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(ServiceTokens.AUTH) private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const { access_token } = context?.getArgs()[0];

    if (!access_token) return false;

    const authenticated = await this.authService.verifyToken(access_token);

    const args = context.getArgs();
    return (args[0] = authenticated);
  }
}
