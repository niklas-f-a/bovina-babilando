import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { makeMongo } from '@app/shared/providers';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const mongoCred = configService.get('authDb');
  const sessionCred = configService.get<{ collection: string; secret: string }>(
    'session',
  );

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    session({
      secret: sessionCred.secret,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
      resave: false,
      saveUninitialized: false,
      store: makeMongo({
        uri: mongoCred.uri,
        collection: sessionCred.collection,
        session,
      }),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: 'http://127.0.0.1:5173',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true,
  });

  const port = configService.get('apiPort');
  await app.listen(port);
}
bootstrap();
