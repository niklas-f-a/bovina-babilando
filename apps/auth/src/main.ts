import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  const rabbitOptions = app
    .get(ConfigService)
    .get<{ url: string; queue: { auth: string } }>('rabbitOptions');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitOptions.url],
      noAck: false,
      queue: rabbitOptions.queue.auth,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.startAllMicroservices();
}
bootstrap();
