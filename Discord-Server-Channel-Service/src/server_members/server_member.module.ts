import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from 'src/servers/server.entity';
import { UserModule } from 'src/users/user.module';
import { RoleModule } from 'src/roles/role.module';
import { ServerMemberService } from './server_member.service';
import { ServerMemberController } from './server_member.controller';
import { ChannelMember } from 'src/channel_members/channel_member.entity';
import { Ban } from 'src/bans/ban.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerMember, Server, ChannelMember, Ban]),
    UserModule,
    RoleModule,
  ],
  controllers: [ServerMemberController],
  providers: [ServerMemberService],
  exports: [ServerMemberService],
})
export class ServerMemberModule {}
