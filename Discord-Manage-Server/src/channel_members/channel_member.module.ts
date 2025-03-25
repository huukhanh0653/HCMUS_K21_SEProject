import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';
import { ChannelMemberService } from './channel_member.service';
import { ChannelMemberController } from './channel_member.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember, Channel]), UserModule],
  providers: [ChannelMemberService],
  controllers: [ChannelMemberController],
  exports: [ChannelMemberService],
})
export class ChannelMemberModule {}
