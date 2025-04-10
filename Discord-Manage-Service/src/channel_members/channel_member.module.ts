import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMemberService } from './channel_member.service';
import { ChannelMemberController } from './channel_member.controller';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember, Channel])],
  providers: [ChannelMemberService],
  controllers: [ChannelMemberController],
  exports: [ChannelMemberService],
})
export class ChannelMemberModule {}
