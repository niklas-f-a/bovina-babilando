import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as makeMongoStore from 'connect-mongodb-session';
import * as passport from 'passport';
import { VersioningType } from '@nestjs/common';

const MongoDBStore = makeMongoStore(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const mongoCred = configService.get('authDb');
  const sessionCred = configService.get<{ collection: string; secret: string }>(
    'session',
  );

  const store = new MongoDBStore({
    uri: mongoCred.uri,
    collection: sessionCred.collection,
  });

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
      store,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = configService.get('apiPort');
  await app.listen(port);
}
bootstrap();
