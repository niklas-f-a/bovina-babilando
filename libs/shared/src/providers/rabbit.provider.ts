import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export default (service: string, queue: string) => ({
  provide: service,
  useFactory: (configService: ConfigService) => {
    const options = configService.get('rabbitOptions');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${options.user}:${options.pass}@${options.host}`],
        queue,
        queueOptions: {
          durable: true,
        },
      },
    });
  },
  inject: [ConfigService],
});
