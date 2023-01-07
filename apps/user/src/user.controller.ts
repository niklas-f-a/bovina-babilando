import { SharedService } from '@app/shared';
import { ServiceTokens } from '@app/shared/config';
import { SignUpDto } from '@app/shared/dto';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(
    @Inject(ServiceTokens.USER) private readonly userService: UserService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'sign-up' })
  signup(@Ctx() context: RmqContext, @Payload() signUpDto: SignUpDto) {
    this.sharedService.rabbitAck(context);

    return this.userService.create(signUpDto);
  }

  @MessagePattern({ cmd: 'find-by-email' })
  findByEmail(@Ctx() context: RmqContext, @Payload() payload: any) {
    this.sharedService.rabbitAck(context);

    return this.userService.findByEmail(payload.email, payload.select);
  }
}
