import { RabbitQueue, ClientTokens } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { SessionSerializer } from './serializer';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AppController } from './app.controller';
import { GithubStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { of, map } from 'rxjs';

describe('AppController', () => {
  let appController: AppController;
  let authController: AuthController;

  const mockSerializer = {};

  const mockStrategy = {
    super: jest.fn(({}) => ({})),
  };

  const mockAuthClient = {};
  const mockUserClient = {
    send: jest.fn(() =>
      of({
        _id: 'dknvlkdnsvlkdn',
        username: 'Billy',
        githubId: 'fjijweifjpwejfpoewjkfp',
        photos: [{ value: 'urlToPhoto' }],
      }),
    ),
  };

  const mockRequest = {
    user: {
      _id: 'dknvlkdnsvlkdn',
      username: 'Billy',
      githubId: 'fjijweifjpwejfpoewjkfp',
      photos: [{ value: 'urlToPhoto' }],
    },
  } as unknown as Request;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AppController, AuthController],
      providers: [
        SessionSerializer,
        GithubStrategy,
        rabbitProvider(ClientTokens.AUTH, RabbitQueue.AUTH),
        rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
      ],
    })
      .overrideProvider(SessionSerializer)
      .useValue(mockSerializer)
      .overrideProvider(GithubStrategy)
      .useValue(mockStrategy)
      .overrideProvider(ClientTokens.AUTH)
      .useValue(mockAuthClient)
      .overrideProvider(ClientTokens.USER)
      .useValue(mockUserClient)
      .compile();

    appController = app.get<AppController>(AppController);
    authController = app.get<AuthController>(AuthController);
  });

  it('should return the user', () => {
    authController
      .signup({}, { email: 'billy@nu.com', password: 'password' })
      .pipe(map((res) => expect(res).toEqual({ message: 'ok' })));
  });
});
