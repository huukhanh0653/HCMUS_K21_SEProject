import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelMember } from './channel_member.entity';
import { Channel } from 'src/channels/channel.entity';
import { UserModule } from 'src/users/user.module';
import { ChannelMemberService } from './channel_member.service';
import { ChannelMemberController } from './channel_member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChannelMember, Channel]), UserModule],
  controllers: [ChannelMemberController],
  providers: [ChannelMemberService],
  exports: [ChannelMemberService],
})
export class ChannelMemberModule {}
