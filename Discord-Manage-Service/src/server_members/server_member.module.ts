import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMemberService } from './server_member.service';
import { ServerMemberController } from './server_member.controller';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([ServerMember, Server]), RoleModule],
  providers: [ServerMemberService],
  controllers: [ServerMemberController],
  exports: [ServerMemberService],
})
export class ServerMemberModule {}
