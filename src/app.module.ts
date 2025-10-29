import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'config/data-source';
import { UsersModule } from './users/users.module';
import { OrderModule } from './order/order.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UsersModule,
    OrderModule,
    JwtModule.register({
      global: true,
      secret: env.jwt.secret,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
