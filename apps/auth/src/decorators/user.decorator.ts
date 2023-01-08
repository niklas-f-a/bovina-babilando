import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const context = ctx.switchToRpc().getContext();
    console.log(context);

    const user = {};

    return user;
  },
);
