import { ServiceTokens } from '@app/shared/config';
import { Controller, Get, Inject } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(@Inject(ServiceTokens.CHAT) private chatService: ChatService) {}

  @Get()
  getHello(): string {
    return this.chatService.getHello();
  }
}
