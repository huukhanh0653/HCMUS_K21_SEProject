import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity'; // Import Server entity
import { ChannelMember } from '../channel_members/channel_member.entity';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { ServerModule } from '../servers/server.module';
import { UserModule } from '../users/user.module';
import { ChannelMemberModule } from '../channel_members/channel_member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Server, ChannelMember]),
    ServerModule,
    UserModule,
    ChannelMemberModule,
  ],
  providers: [ChannelService],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
