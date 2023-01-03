import { SharedModule } from '@app/shared';
import { configuration, ServiceTokens } from '@app/shared/config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { dbConnection, User, UserSchema } from './db';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './.env',
          load: [configuration],
        }),
        dbConnection,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        SharedModule,
      ],
      controllers: [AuthController],
      providers: [
        { provide: ServiceTokens.AUTH_SERVICE, useClass: AuthService },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
