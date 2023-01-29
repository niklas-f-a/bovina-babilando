import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as makeMongoStore from 'connect-mongodb-session';
import * as passport from 'passport';
import { ValidationPipe, VersioningType } from '@nestjs/common';

const MongoDBStore = makeMongoStore(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let store;

  const configService = app.get(ConfigService);
  const mongoCred = configService.get('authDb');
  const sessionCred = configService.get<{ collection: string; secret: string }>(
    'session',
  );

  if (process.env.NODE_ENV !== 'test') {
    store = new MongoDBStore({
      uri: mongoCred.uri,
      collection: sessionCred.collection,
    });

    // store.clear((err) => {
    //   console.log(err, 'is');
    // });
  }

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = configService.get('apiPort');
  await app.listen(port);
}
bootstrap();
