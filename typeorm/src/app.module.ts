import { Module } from '@nestjs/common';
import { ConfigurationModule } from './app/configuration';
import { DatabaseModule } from './app/database';
import { AuthModule } from './modules/auth';
import { UsersModule } from './modules/users';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
