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

  @MessagePattern({ cmd: 'get-chat-rooms' })
  getAllChatRooms(
    @Payload('chatRoomIds') chatRoomIds: string[],
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);

    return this.chatService.getAllChatRooms(chatRoomIds);
  }

  @MessagePattern({ cmd: 'post-message' })
  postMessage(@Ctx() context: RmqContext) {
    this.sharedService.rabbitAck(context);

    return this.chatService.addMessage();
  }

  @MessagePattern({ cmd: 'find-chat-room' })
  findOneChatRoom(
    @Payload('chatRoomId') chatRoomId: string,
    @Ctx() context: RmqContext,
  ) {
    this.sharedService.rabbitAck(context);

    return this.chatService.findOneChatRoom(chatRoomId);
  }
}
