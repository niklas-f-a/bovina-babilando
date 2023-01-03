import { configuration, RabbitQueue, ServiceTokens } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { SessionSerializer } from '@app/shared/serializer';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AppController } from './app.controller';
import { GithubStrategy } from './strategies';

describe('AppController', () => {
  let appController: AppController;

  const mockSerializer = {};

  const mockStrategy = {
    super: jest.fn(),
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
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './.env',
          load: [configuration],
        }),
        PassportModule.register({ session: true }),
      ],
      controllers: [AppController],
      providers: [
        SessionSerializer,
        GithubStrategy,
        rabbitProvider(ServiceTokens.AUTH_SERVICE, RabbitQueue.AUTH),
      ],
    })
      .overrideGuard(SessionSerializer)
      .useValue(mockSerializer)
      .overrideGuard(GithubStrategy)
      .useValue(mockStrategy)
      .overrideGuard(ServiceTokens.AUTH_SERVICE)
      .useValue(mockAuthClient)
      .compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return the user', () => {
    expect(appController.getMe(mockRequest)).toEqual({
      _id: expect.any(String),
      username: 'Billy',
      githubId: expect.any(String),
      photos: [{ value: expect.any(String) }],
    });
  });
});
