import { SharedModule, SharedService } from '@app/shared';
import { ServiceTokens } from '@app/shared/config';
import { RmqContext } from '@nestjs/microservices';

import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011' as unknown as ObjectId,
    githubId: 'flökeflewifh',
    username: 'Bob',
    photos: [{ value: 'urlToImage' }],
  };

  const mockAuthService = {
    findUserById: jest.fn().mockResolvedValueOnce(mockUser),
    findOrCreate: jest.fn((dto) => dto),
    createUser: jest.fn(),
  };

  const mockSharedService = {
    rabbitAck: jest.fn((context) => ({})),
  };

  const mockRabbitContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [AuthController],
      providers: [
        { provide: ServiceTokens.AUTH_SERVICE, useClass: AuthService },
      ],
    })
      .overrideProvider(ServiceTokens.AUTH_SERVICE)
      .useValue(mockAuthService)
      .overrideProvider(SharedService)
      .useValue(mockSharedService)
      .compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should return user', async () => {
    expect(
      await authController.findUser('rofheiwu38', mockRabbitContext),
    ).toEqual(mockUser);
  });

  it('should create and return user if not found', async () => {
    expect(
      await authController.findOrCreate(mockUser, mockRabbitContext),
    ).toEqual(mockUser);
  });
});
