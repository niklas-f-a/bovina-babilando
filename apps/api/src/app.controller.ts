import { ClientTokens } from '@app/shared/config';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SignUpDto } from '@app/shared/dto';
import { map } from 'rxjs';

@Controller({
  version: '1',
})
export class AppController {
  constructor(
    // @Inject('CHAT_SERVICE') private chatService: ClientProxy,
    @Inject(ClientTokens.AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    return this.userClient.send({ cmd: 'sign-up' }, signUpDto).pipe(
      map((value) => {
        if (value.status === 409) {
          return value.response;
        }
        return value;
      }),
    );
  }

  // @Get('/github/login')
  // @UseGuards(GithubAuthGuard)
  // loginGithub() {
  //   return;
  // }

  // @Get('/github/callback')
  // @UseGuards(GithubAuthGuard)
  // authCallback() {
  //   // send event to chat
  //   return { message: 'ok' };
  // }

  // @Get('me')
  // @UseGuards(AuthenticatedGuard)
  // getMe(@Req() req: Request) {
  //   return req.user;
  // }

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
}
