import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt } from '.';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(ExtractJwt) extractJwt: ExtractJwt) {
    console.log(extractJwt.getToken(), 'extractor');

    super({
      jwtFromRequest: extractJwt.getToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log(payload, 'from strategy');

    return { ...payload };
  }
}
