import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.module';
import { ConfigurationModule } from './configuration';
import { DatabaseModule } from './database';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
