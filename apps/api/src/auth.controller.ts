import { ClientTokens } from '@app/shared/config';
import {
  Body,
  Controller,
  Inject,
  Post,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto, SignUpDto } from '@app/shared/dto';
import { catchError, map, switchMap } from 'rxjs';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject(ClientTokens.AUTH) private authClient: ClientProxy,
    @Inject(ClientTokens.USER) private userClient: ClientProxy,
  ) {}

  @Post('signup')
  signup(
    @Session() session: Record<string, any>,
    @Body() signUpDto: SignUpDto,
  ) {
    return this.userClient.send({ cmd: 'sign-up' }, signUpDto).pipe(
      map((value) => {
        if (value.status === 409) {
          throw value.response;
        }
        return value;
      }),
      switchMap(({ email }) =>
        this.authClient.send(
          { cmd: 'login' },
          { email, password: signUpDto.password },
        ),
      ),
      map((value) => {
        session['access_token'] = value.access_token;
        return { message: 'ok' };
      }),
    );
  }

  @Post('login')
  login(@Session() session: Record<string, any>, @Body() loginDto: LoginDto) {
    return this.authClient.send({ cmd: 'login' }, loginDto).pipe(
      map((value) => {
        session['access_token'] = value.access_token;
        return { message: 'ok' };
      }),
      catchError((error) => {
        throw new UnauthorizedException(error.message);
      }),
    );
  }
}
