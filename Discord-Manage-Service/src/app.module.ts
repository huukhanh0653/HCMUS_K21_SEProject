import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerModule } from './servers/server.module';
import { RoleModule } from './roles/role.module';
import { ServerMemberModule } from './server_members/server_member.module';
import { ChannelModule } from './channels/channel.module';
import { ChannelMemberModule } from './channel_members/channel_member.module';
import * as dotenv from 'dotenv';

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
    RoleModule,
    ServerMemberModule,
    ChannelModule,
    ChannelMemberModule,
  ],
})
export class AppModule {}
