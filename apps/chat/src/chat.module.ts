import { SharedService } from '@app/shared';
import {
  ClientTokens,
  configuration,
  RabbitQueue,
  ServiceTokens,
} from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { dbConnection } from './db/connection';
import { ChatRoom, Message } from './db/models';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    SequelizeModule.forFeature([ChatRoom, Message]),
    ...dbConnection,
    GatewayModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwtSecret'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [ChatController],
  providers: [
    SharedService,
    { provide: ServiceTokens.CHAT, useClass: ChatService },
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
    rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
  ],
})
export class ChatModule {}
