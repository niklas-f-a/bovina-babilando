import { SharedModule, SharedService } from '@app/shared';
import { ServiceTokens } from '@app/shared/config';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { dbConnection, User, UserSchema } from './db';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {};
  const mockSharedService = {};

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: ServiceTokens.USER,
          useClass: UserService,
        },
        {
          provide: getModelToken(User.name),
          useValue: User,
        },
      ],
    })
      .overrideProvider(ServiceTokens.USER)
      .useValue(mockUserService)
      .overrideProvider(SharedService)
      .useValue(mockSharedService)
      .compile();

    userController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(userController).toBeDefined();
    });
  });
});
