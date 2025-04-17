import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from './channel.service';
import { Channel } from './channel.entity';
import { Server } from 'src/servers/server.entity';
import { ChannelMember } from 'src/channel_members/channel_member.entity';
import { ServerMemberModule } from 'src/server_members/server_member.module';
import { ChannelMemberModule } from 'src/channel_members/channel_member.module';
import { ChannelController } from './channel.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Server, ChannelMember]),
    ServerMemberModule,
    ChannelMemberModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
