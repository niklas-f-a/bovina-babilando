import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

export const dbConnection = [
  SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
      const dbOptions = configService.get('chatDb');

      return {
        dialect: 'postgres',
        ...dbOptions,
        autoLoadModels: true,
        synchronize: true,
      };
    },
    inject: [ConfigService],
  }),
];
