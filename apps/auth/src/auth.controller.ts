import { SharedService } from '@app/shared';
import { Controller, Inject, UseGuards } from '@nestjs/common';
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
import { JwtAuthGuard } from './guards';

@Controller()
export class AuthController {
  constructor(
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
    private readonly sharedService: SharedService,
    @Inject(ServiceTokens.AUTH) private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'login' })
  findOrCreate(@Payload() cred: Credentials, @Ctx() context: RmqContext) {
    this.sharedService.rabbitAck(context);

    const findPayload = {
      email: cred.email,
      select: 'password',
    };

    return this.userClient
      .send({ cmd: 'find-by-email' }, findPayload)
      .pipe(switchMap((user: IUser) => this.authService.login(cred, user)));
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'verify-jwt' })
  verifyJwt(@Ctx() context: RmqContext, @Payload() payload: Partial<IUser>) {
    this.sharedService.rabbitAck(context);
    // console.log(payload, 'payload');

    return payload;
  }
}
