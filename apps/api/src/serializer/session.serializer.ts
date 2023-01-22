import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer } from '@nestjs/passport';
import { IUser, User } from 'apps/user/src/db/user.schema';
import { firstValueFrom, map } from 'rxjs';
import { ClientTokens } from '../../../../libs/shared/src/config';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject(ClientTokens.USER) private userService: ClientProxy) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    // Change stored value and fix deserialization

    done(null, user);
  }

  async deserializeUser(user: IUser, done: (err: Error, user: User) => void) {
    const foundUser = await firstValueFrom(
      this.userService
        .send({ cmd: 'find-github-user' }, user?.githubId)
        .pipe(map((value) => value)),
    );

    return foundUser ? done(null, foundUser) : done(null, null);
  }
}
