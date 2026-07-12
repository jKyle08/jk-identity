import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequestUser } from '../../infrastructure/passport/jwt.strategy';

export const CurrentIdentity = createParamDecorator(
  (data: keyof AuthenticatedRequestUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthenticatedRequestUser;

    return data ? user?.[data] : user;
  },
);
