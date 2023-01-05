import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@app/shared/user.schema';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { ServiceTokens } from '../config';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject(ServiceTokens.AUTH_SERVICE) private authService: ClientProxy,
  ) {
    super();
  }

  serializeUser(user: User, done: (err: Error, user: User) => void) {
    // Change stored value and fix deserialization
    done(null, user);
  }

  async deserializeUser(user: User, done: (err: Error, user: User) => void) {
    const foundUser = await firstValueFrom(
      this.authService
        .send({ cmd: 'find-github-user' }, user.githubId)
        .pipe(switchMap((fUser: User) => of(fUser))),
    );

    return foundUser ? done(null, foundUser) : done(null, null);
  }
}
