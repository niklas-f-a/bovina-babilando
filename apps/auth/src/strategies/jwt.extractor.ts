import { Inject, Injectable } from '@nestjs/common';
import { CONTEXT, RequestContext } from '@nestjs/microservices';

@Injectable()
export class ExtractJwt {
  private token: string;

  constructor(@Inject(CONTEXT) private ctx: RequestContext) {
    this.token = this.ctx.getContext().args[0].properties.headers?.token;
  }

  getToken() {
    return this.token;
  }
}
