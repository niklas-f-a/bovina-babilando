import { configuration } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { SessionSerializer } from '@app/shared/serializer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    SessionSerializer,
    GithubStrategy,
    rabbitProvider('AUTH_SERVICE', 'auth_queue'),
  ],
})
export class AppModule {}
