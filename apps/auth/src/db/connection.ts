import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

export const dbConnection = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const { username, password, host, name, options } =
      configService.get('authDb');

    return {
      uri: `mongodb://${username}:${password}@${host}/${name}${options}`,
    };
  },
  inject: [ConfigService],
});
