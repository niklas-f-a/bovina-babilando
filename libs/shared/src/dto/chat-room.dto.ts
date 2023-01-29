import { IsString } from 'class-validator';

export class ChatRoomDto {
  userId: string;

  @IsString()
  name: string;
}
