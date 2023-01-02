import { SharedModule } from '@app/shared';
import { configuration } from '@app/shared/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { dbConnection, User, UserSchema } from './db';

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
  ],
  controllers: [AuthController],
  providers: [{ provide: 'AUTH_SERVICE', useClass: AuthService }],
})
export class AuthModule {}
