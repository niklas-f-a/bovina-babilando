import { ServiceTokens } from '@app/shared/config';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [{ provide: ServiceTokens.USER_SERVICE, useClass: UserService }],
})
export class UserModule {}
