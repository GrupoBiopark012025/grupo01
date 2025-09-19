import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import mikroOrmConfig from '../mikro-orm.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: () => mikroOrmConfig
    }),
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
