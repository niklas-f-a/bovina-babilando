import { ChatRoomDto } from '@app/shared/dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatRoom } from './db/models';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatRoom)
    private chatRoomModel: typeof ChatRoom,
  ) {}

  async createChatRoom(chatRoomDto: ChatRoomDto) {
    return await this.chatRoomModel.create({
      ...chatRoomDto,
      createdBy: chatRoomDto.userId,
    });
  }
}
