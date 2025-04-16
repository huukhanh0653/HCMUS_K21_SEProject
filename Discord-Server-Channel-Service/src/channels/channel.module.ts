import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { ChannelMemberModule } from '../channel_members/channel_member.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, Server]),
    ChannelMemberModule,
    UserModule,
  ],
  providers: [ChannelService],
  controllers: [ChannelController],
  exports: [ChannelService],
})
export class ChannelModule {}
