import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { Profile } from 'passport';
import { ClientProxy } from '@nestjs/microservices';
import { map, firstValueFrom } from 'rxjs';
import { ClientTokens } from '@app/shared/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(@Inject(ClientTokens.USER) private userClient: ClientProxy) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['public_profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id: githubId, username, photos } = profile;
    // CHANGES NEEDED
    return await firstValueFrom(
      this.userClient.send(
        { cmd: 'find-or-create-from-githubId' },
        {
          githubId,
          username,
          photos,
        },
      ),
    );
  }
}
