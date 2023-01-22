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
    // @Inject('CHAT_SERVICE') private chatService: ClientProxy,
    @Inject(ClientTokens.AUTH) private authClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}

  // @Post('auth/login')
  // async login(
  //   @Session() session: Record<string, any>,
  //   @Body() payload: LoginDto,
  // ) {
  //   const access_token = (await firstValueFrom(
  //     this.authClient.send({ cmd: 'login' }, payload).pipe(
  //       switchMap((res) => {
  //         if (res.status === 403) {
  //           throw new ForbiddenException({ ...res.response });
  //         }
  //         return of(res.access_token);
  //       }),
  //     ),
  //   )) as string;

  //   session['access_token'] = access_token;
  //   return { message: 'ok' };
  // }

  // @Get('test-guard')
  // testGuard(@Req() req: Request) {
  //   console.log(req);

  //   const access_token = 'token';
  //   const record = new RmqRecordBuilder()
  //     .setOptions({
  //       headers: { ['token']: access_token },
  //     })
  //     .build();
  //   return this.authClient.send({ cmd: 'status' }, record);
  // }

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
    console.log(user);

    return user;
  }
}
