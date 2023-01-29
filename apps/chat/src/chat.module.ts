import { SharedService } from '@app/shared';
import {
  ClientTokens,
  configuration,
  RabbitQueue,
  ServiceTokens,
} from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { dbConnection } from './db/connection';
import { ChatRoom } from './db/models';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    SequelizeModule.forFeature([ChatRoom]),
    ...dbConnection,
  ],
  controllers: [ChatController],
  providers: [
    SharedService,
    { provide: ServiceTokens.CHAT, useClass: ChatService },
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
  ],
})
export class ChatModule {}
