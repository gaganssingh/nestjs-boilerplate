import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../modules/users/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:
        process.env.NODE_ENV === 'test'
          ? (configService: ConfigService) => ({
              type: 'sqlite',
              database: configService.get('DB_DATABASE'),
              autoLoadEntities: true,
              synchronize: true,
              logging: false,
            })
          : async (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: Number(configService.get('DB_PORT')),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE'),
              entities: [User],
              synchronize: process.env.NODE_ENV !== 'production',
              logging: process.env.NODE_ENV === 'development',
            }),
    }),
  ],
})
export class DatabaseModule {}
