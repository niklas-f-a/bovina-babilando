import { ChatRoomDto } from '@app/shared/dto';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/sequelize';
import { catchError, concatMap, from, toArray } from 'rxjs';
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

  getAllChatRooms(chatRoomId: string[]) {
    return from(chatRoomId).pipe(
      concatMap((value) => this.chatRoomModel.findByPk(value)),
      toArray(),
      catchError((error) => {
        throw new RpcException(error.message);
      }),
    );
  }
}
