import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credentials, IUser } from '../../user/src/db';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(cred: Credentials, user: IUser) {
    if (!user) return new UnauthorizedException();
    console.log(cred, user);

    const isMatch = await this.verifyPassword(cred.password, user.password);
    if (!isMatch) {
      return new UnauthorizedException();
    }
    const access_token = await this.jwtService.signAsync({
      sub: user._id,
      email: user.email,
      githubId: user.githubId,
    });

    return { access_token };
  }

  verifyPassword(password: string, hashPass: string) {
    return bcrypt.compare(password, hashPass);
  }
}
