import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/transform.interceptor';
import { ServerModule } from './servers/server.module';
import { ServerMemberModule } from './server_members/server_member.module';
import { RoleModule } from './roles/role.module';
import { ChannelModule } from './channels/channel.module';
import { ChannelMemberModule } from './channel_members/channel_member.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_SINGAPORE_CONNECTION_STRING,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    }),
    ServerModule,
    ServerMemberModule,
    RoleModule,
    ChannelModule,
    ChannelMemberModule,
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
