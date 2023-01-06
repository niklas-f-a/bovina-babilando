import { ServiceTokens, configuration, RabbitQueue } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { SessionSerializer } from '@app/shared/serializer';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
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
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    SessionSerializer,
    GithubStrategy,
    rabbitProvider(ServiceTokens.AUTH_SERVICE, RabbitQueue.AUTH),
    rabbitProvider(ServiceTokens.USER_SERVICE, RabbitQueue.USER),
  ],
})
export class AppModule {}
