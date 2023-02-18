import { ClientTokens } from '@app/shared/config';
import {
  Controller,
  ForbiddenException,
  Get,
  Inject,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenticatedGuard } from '../../auth/src/guards';
import { IUser } from 'apps/user/src/db';
import { catchError } from 'rxjs';
import { User } from './decorators';

@Controller({
  version: '1',
})
export class AppController {
  constructor(
    @Inject(ClientTokens.AUTH) private authClient: ClientProxy,
    @Inject(ClientTokens.CHAT) private chatClient: ClientProxy,
  ) {}

  // DONT USE
  @Get('test')
  testGuard(@Session() session: any) {
    const { access_token } = session;
    return this.authClient.send({ cmd: 'verify-jwt' }, { access_token }).pipe(
      catchError((error) => {
        throw new ForbiddenException(error.message);
      }),
    );
  }

  @UseGuards(AuthenticatedGuard)
  @Get('testgithub')
  githubGuard(@User() user: Partial<IUser>) {
    return user;
  }

  @Get('testmessage')
  testMessage() {
    return this.chatClient.send({ cmd: 'post-message' }, {});
  }
}
