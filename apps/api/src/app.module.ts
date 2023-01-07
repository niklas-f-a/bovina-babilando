import { ClientTokens, configuration, RabbitQueue } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { SessionSerializer } from 'apps/api/src/serializer';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    SessionSerializer,
    GithubStrategy,
    rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
  ],
})
export class AppModule {}
