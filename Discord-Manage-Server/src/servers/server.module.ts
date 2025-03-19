import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';
import { Channel } from '../channels/channel.entity';
import { ServerMember } from '../server_members/server_member.entity';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { ChannelService } from '../channels/channel.service';
import { ChannelController } from '../channels/channel.controller';
import { ServerMemberService } from '../server_members/server_member.service';
import { ServerMemberController } from '../server_members/server_member.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server, Channel, ServerMember, User])],
  providers: [ServerService, ChannelService, ServerMemberService],
  controllers: [ServerController, ChannelController, ServerMemberController],
  exports: [ServerService, ChannelService, ServerMemberService],
})
export class ServerModule {}
