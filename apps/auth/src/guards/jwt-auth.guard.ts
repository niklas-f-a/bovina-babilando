import { ServiceTokens } from '@app/shared/config';
import { ExecutionContext, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';

export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(@Inject(ServiceTokens.AUTH) private authService: AuthService) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    const { access_token } = context?.getArgs()[0];

    if (!access_token) return false;

    const authUser = await this.authService.verifyToken(access_token);

    if (authUser?.expiredAt < new Date()) {
      throw new RpcException({ status: 403, message: 'jwt expired' });
    }

    const args = context.getArgs();
    return (args[0] = authUser);
  }
}
