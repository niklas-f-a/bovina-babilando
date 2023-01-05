import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { RabbitQueue } from '../config';

export default (service: string, queue: RabbitQueue) => ({
  provide: service,
  useFactory: (configService: ConfigService) => {
    const options = configService.get<{
      url: string;
      queue: { auth: string; chat: string; user: string };
    }>('rabbitOptions');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [options.url],
        queue: options.queue[queue],
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
});
