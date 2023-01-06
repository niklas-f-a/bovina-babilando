import { ServiceTokens } from '@app/shared/config';
import { SignUpDto } from '@app/shared/dto';
import { AuthenticatedGuard, GithubAuthGuard } from '@app/shared/guards';
import { IUser } from 'apps/user/src/db/user.schema';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { LoginDto } from '@app/shared/dto/login.dto';
import { Request } from 'express';
import { firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';

@Controller({
  version: '1',
})
export class AppController {
  constructor(
    // @Inject('CHAT_SERVICE') private chatService: ClientProxy,
    @Inject(ServiceTokens.AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(ServiceTokens.USER_SERVICE) private userClient: ClientProxy,
  ) {}

  @Post('signup')
  async signup(signupDto: SignUpDto): Promise<any> {
    return firstValueFrom(this.userClient.send({ cmd: 'signup' }, signupDto));
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
