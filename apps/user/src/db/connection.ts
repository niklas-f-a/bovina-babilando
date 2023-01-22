import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const dbConnection = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    if (process.env.NODE_ENV !== 'test') {
      const { uri } = configService.get<{ uri: string }>('authDb');

      return { uri };
    }
  },
  inject: [ConfigService],
});
