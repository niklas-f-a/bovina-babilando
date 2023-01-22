import { SharedModule, SharedService } from '@app/shared';
import { ClientTokens, RabbitQueue, ServiceTokens } from '@app/shared/config';
import { rabbitProvider } from '@app/shared/providers';
import { RmqContext } from '@nestjs/microservices';

import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExtractJwt } from './strategies';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011' as unknown as ObjectId,
    githubId: 'flökeflewifh',
    email: 'Bob',
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

  const mockUserClient = {};

  const mockRabbitContext = {} as unknown as RmqContext;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [AuthController],
      providers: [
        ExtractJwt,
        { provide: ServiceTokens.AUTH, useClass: AuthService },
        rabbitProvider(ClientTokens.USER, RabbitQueue.USER),
      ],
    })
      .overrideProvider(ServiceTokens.AUTH)
      .useValue(mockAuthService)
      .overrideProvider(SharedService)
      .useValue(mockSharedService)
      .overrideProvider(ClientTokens.USER)
      .useValue(mockUserClient)
      .compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  // it('should return user', async () => {
  //   expect(
  //     await authController.findUser('rofheiwu38', mockRabbitContext),
  //   ).toEqual(mockUser);
  // });

  // it('should create and return user if not found', async () => {
  //   expect(
  //     await authController.findOrCreate(mockUser, mockRabbitContext),
  //   ).toEqual(mockUser);
  // });
});
