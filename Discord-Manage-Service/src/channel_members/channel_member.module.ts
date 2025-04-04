import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMemberService } from './channel_member.service';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember, Channel]), UserModule],
  providers: [ChannelMemberService],
  exports: [ChannelMemberService],
})
export class ChannelMemberModule {}
