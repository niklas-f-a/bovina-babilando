import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT, RequestContext } from '@nestjs/microservices';

@Injectable()
export class ExtractJwt {
  token: string;

  constructor(@Inject(CONTEXT) private ctx: RequestContext) {
    console.log(
      this.ctx.getContext().args[0].properties.headers?.access_token,
      'extractor',
    );

    return this.ctx.getContext().args[0].properties.headers?.access_token;
  }

  getToken() {
    return this.token;
  }
}
