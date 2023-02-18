import { ClientTokens } from '@app/shared/config';
import { ChatRoomDto } from '@app/shared/dto';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthenticatedGuard } from 'apps/auth/src/guards';
import { RIUser } from 'apps/user/src/db';
import { map, switchMap } from 'rxjs';
import { User } from '../src/decorators';

@UseGuards(AuthenticatedGuard)
@Controller({
  version: '1',
  path: 'chat',
})
export class ChatController {
  constructor(
    @Inject(ClientTokens.CHAT) private chatClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}

  @Post()
  createChatRoom(@Body() chatRoomDto: ChatRoomDto, @User() user: RIUser) {
    const payload = {
      userId: user.sub,
      ...chatRoomDto,
    };
    return this.chatClient.send({ cmd: 'add-chat-room' }, payload).pipe(
      map((value) => ({ chatRoomId: value.id, userId: user.sub })),
      switchMap((value) =>
        this.userClient.send({ cmd: 'add-chat-room' }, { ...value }),
      ),
    );
  }

  @Get()
  findAllChatRooms(@User() user: RIUser) {
    const payload = {
      userId: user.sub,
      email: user.email,
    };
    return this.userClient
      .send({ cmd: 'find-by-email' }, payload)
      .pipe(
        switchMap((value) =>
          this.chatClient.send(
            { cmd: 'get-chat-rooms' },
            { chatRoomIds: value.chatRooms },
          ),
        ),
      );
  }
}
