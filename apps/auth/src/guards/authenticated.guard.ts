import { ClientTokens } from '@app/shared/config';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(@Inject(ClientTokens.AUTH) private authClient: ClientProxy) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { access_token } = req.session;

    if (access_token) {
      const user = await firstValueFrom(
        this.authClient.send({ cmd: 'verify-jwt' }, { access_token }),
      );
      console.log(user);

      if (user?.expiredAt || !user) return req.isAuthenticated();

      req.user = user;
      return true;
    }
    return req.isAuthenticated();
  }
}
