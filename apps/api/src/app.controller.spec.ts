import { RabbitQueue, ClientTokens } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { SessionSerializer } from '@app/shared/serializer';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AppController } from './app.controller';
import { GithubStrategy } from './strategies';

describe('AppController', () => {
  let appController: AppController;

  const mockSerializer = {};

  const mockStrategy = {
    super: jest.fn(({}) => ({})),
  };

  const mockAuthClient = {};

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
      controllers: [AppController],
      providers: [
        SessionSerializer,
        GithubStrategy,
        rabbitProvider(ClientTokens.AUTH_SERVICE, RabbitQueue.AUTH),
      ],
    })
      .overrideProvider(SessionSerializer)
      .useValue(mockSerializer)
      .overrideProvider(GithubStrategy)
      .useValue(mockStrategy)
      .overrideProvider(ClientTokens.AUTH_SERVICE)
      .useValue(mockAuthClient)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return the user', () => {
    expect(
      appController.signup({ email: 'billy@nu.com', password: 'password' }),
    ).toEqual({
      _id: expect.any(String),
      username: 'Billy',
      githubId: expect.any(String),
      photos: [{ value: expect.any(String) }],
    });
  });
});
