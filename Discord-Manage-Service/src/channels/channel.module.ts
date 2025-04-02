import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { UserModule } from '../users/user.module';
import { ChannelMemberModule } from '../channel_members/channel_member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Server]),
    UserModule,
    ChannelMemberModule,
  ],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
