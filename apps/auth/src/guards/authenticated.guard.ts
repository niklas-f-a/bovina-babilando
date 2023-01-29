import { ClientTokens } from '@app/shared/config';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
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

    try {
      if (access_token) {
        const user = await firstValueFrom(
          this.authClient.send({ cmd: 'verify-jwt' }, { access_token }),
        );

        return (req.user = user);
      } else {
        return req.isAuthenticated();
      }
    } catch (error) {
      if (error.status === 403) {
        throw new ForbiddenException();
      }

      return req.isAuthenticated();
    }
  }
}
