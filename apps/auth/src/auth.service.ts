import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Credentials, IUser } from '../../user/src/db';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(cred: Credentials, user: IUser) {
    if (!user) throw new RpcException('Invalid credentials.');

    const isMatch = await this.verifyPassword(cred.password, user.password);
    if (!isMatch) {
      throw new RpcException('Invalid credentials.');
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

  async verifyToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error?.expiredAt < new Date()) {
        throw new UnauthorizedException('Token Expired');
      }
      throw error;
    }
  }
}
