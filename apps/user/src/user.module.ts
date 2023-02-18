import { SharedModule } from '@app/shared';
import { configuration, ServiceTokens } from '@app/shared/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConnection, User, UserSchema } from './db';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    SharedModule,
    dbConnection,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: ServiceTokens.USER,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
