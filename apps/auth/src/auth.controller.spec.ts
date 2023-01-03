import { SharedModule } from '@app/shared';
import { ServiceTokens } from '@app/shared/config';

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    findUserById: jest.fn((dto) => dto),
  };

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
      .compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
