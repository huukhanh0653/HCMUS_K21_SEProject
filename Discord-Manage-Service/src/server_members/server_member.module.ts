import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMemberService } from './server_member.service';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { UserModule } from '../users/user.module';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerMember, Server]),
    UserModule,
    RoleModule,
  ],
  providers: [ServerMemberService],
})
export class ServerMemberModule {}
