import { SharedModule } from '@app/shared';
import { configuration, ClientTokens, ServiceTokens } from '@app/shared/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { dbConnection, User, UserSchema } from './db';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      load: [configuration],
    }),
    SharedModule,
    dbConnection,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function () {
            if (this?.githubId) {
              return;
            }
            this.password = await bcrypt.hash(this.password, 10);
          });

          return schema;
        },
      },
    ]),
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
