import { SharedModule } from '@app/shared';
import { configuration, ServiceTokens } from '@app/shared/config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { dbConnection, User, UserSchema } from './db';
import { ExtractJwt } from './strategies/jwt.extractor';
import { JwtStrategy } from './strategies/jwtAuth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    dbConnection,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
    { provide: ServiceTokens.AUTH_SERVICE, useClass: AuthService },
    JwtStrategy,
    ExtractJwt,
  ],
})
export class AuthModule {}
