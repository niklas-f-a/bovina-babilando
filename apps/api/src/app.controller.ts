import { AuthenticatedGuard, GithubAuthGuard } from '@app/shared/guards';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

@Controller()
export class AppController {
  // constructor(
  //   @Inject('AUTH_SERVICE') private authClient: ClientProxy,
  //   @Inject('CHAT_SERVICE') private chatService: ClientProxy,
  // ) {}

  @Get('/github/login')
  @UseGuards(GithubAuthGuard)
  login() {
    return;
  }

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  authCallback() {
    // send event to chat
    return { message: 'ok' };
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }
}
