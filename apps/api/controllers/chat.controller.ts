import { ClientTokens } from '@app/shared/config';
import { ChatRoomDto } from '@app/shared/dto';
import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenticatedGuard } from 'apps/auth/src/guards';
import { RIUser } from 'apps/user/src/db';
import { User } from '../src/decorators';

@UseGuards(AuthenticatedGuard)
@Controller({
  version: '1',
  path: 'chat',
})
export class ChatController {
  constructor(@Inject(ClientTokens.CHAT) private chatClient: ClientProxy) {}

  @Post()
  createChatRoom(@Body() chatRoomDto: ChatRoomDto, @User() user: RIUser) {
    const payload = {
      userId: user.sub,
      ...chatRoomDto,
    };
    return this.chatClient.send({ cmd: 'add-chat-room' }, payload);
  }
}
