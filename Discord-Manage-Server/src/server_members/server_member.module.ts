import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { ServerMemberService } from './server_member.service';
import { ServerMemberController } from './server_member.controller';
import { ServerModule } from '../servers/server.module';
import { UserModule } from '../users/user.module';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerMember, Server]),
    ServerModule,
    UserModule,
    RoleModule,
  ],
  providers: [ServerMemberService],
  controllers: [ServerMemberController],
  exports: [ServerMemberService],
})
export class ServerMemberModule {}
