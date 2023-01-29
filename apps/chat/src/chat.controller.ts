import { SharedService } from '@app/shared';
import { ServiceTokens } from '@app/shared/config';
import { ChatRoomDto } from '@app/shared/dto';
import { Controller, Inject } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(
    @Inject(ServiceTokens.CHAT) private chatService: ChatService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'add-chat-room' })
  createChatRoom(
    @Payload() chatRoomDto: ChatRoomDto,
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);

    const newChatRoom = this.chatService.createChatRoom(chatRoomDto);
    // emit to WS
    return newChatRoom;
  }
}
