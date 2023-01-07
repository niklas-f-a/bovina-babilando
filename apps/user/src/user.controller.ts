import { SharedService } from '@app/shared';
import { SignUpDto } from '@app/shared/dto';
import { Controller } from '@nestjs/common';
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
    private readonly userService: UserService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'sign-up' })
  signup(@Ctx() context: RmqContext, @Payload() signUpDto: SignUpDto) {
    this.sharedService.rabbitAck(context);

    return this.userService.create(signUpDto);
  }

  @MessagePattern({ cmd: 'find-by-email' })
  async findByEmail(@Ctx() context: RmqContext, @Payload() payload: any) {
    this.sharedService.rabbitAck(context);

    return await this.userService.findByEmail(payload.email, payload.select);
  }
}
