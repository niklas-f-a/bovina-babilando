import { SharedService } from '@app/shared';
import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Credentials, IUser } from '../../user/src/db';
import { ClientTokens, ServiceTokens } from '@app/shared/config';
import { switchMap } from 'rxjs';

@Controller()
export class AuthController {
  constructor(
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
    private readonly sharedService: SharedService,
    @Inject(ServiceTokens.AUTH) private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  async findOrCreate(@Payload() cred: Credentials, @Ctx() context: RmqContext) {
    this.sharedService.rabbitAck(context);

    const findPayload = {
      email: cred.email,
      select: 'password',
    };

    return this.userClient.send({ cmd: 'find-by-email' }, findPayload).pipe(
      switchMap((user: IUser) => {
        return this.authService.login(cred, user);
      }),
    );
  }
}
