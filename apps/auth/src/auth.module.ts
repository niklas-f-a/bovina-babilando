import { SharedModule } from '@app/shared';
import {
  configuration,
  ClientTokens,
  RabbitQueue,
  ServiceTokens,
} from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    SharedModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get('jwtSecret'),
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: ServiceTokens.AUTH,
      useClass: AuthService,
    },
    rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
  ],
})
export class AuthModule {}
