import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerModule } from './servers/server.module';
import * as dotenv from 'dotenv';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/transform.interceptor';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channels/channel.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_SINGAPORE_CONNECTION_STRING,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    ServerModule,
    ChannelModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
