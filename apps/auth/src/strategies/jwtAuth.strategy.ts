import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt } from './jwt.extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public extractor: ExtractJwt) {
    super({
      jwtFromRequest: extractor.getToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { ...payload };
  }
}
