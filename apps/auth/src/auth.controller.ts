import { SharedService } from '@app/shared';
import { AuthFrom } from '@app/shared/config';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { User } from './db';

@Controller()
export class AuthController {
  constructor(
    private readonly sharedService: SharedService,
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {}

  @MessagePattern({ cmd: 'find-or-create-from-githubId' })
  async findOrCreate(@Payload() user: User, @Ctx() context: RmqContext) {
    this.sharedService.rabbitAck(context);

    return await this.authService.findOrCreate(user, AuthFrom.GITHUB_ID);
  }

  @MessagePattern({ cmd: 'find-github-user' })
  async findUser(
    @Payload() githubId: string,
    @Ctx() context: RmqContext,
  ): Promise<User> {
    this.sharedService.rabbitAck(context);

    return await this.authService.findUserById(githubId, AuthFrom.GITHUB_ID);
  }
}
