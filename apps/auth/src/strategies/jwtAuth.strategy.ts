import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

interface JwtRequest extends Request {
  access_token?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: JwtRequest) => request?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log(payload, 'from strategy');

    return { ...payload };
  }
}
