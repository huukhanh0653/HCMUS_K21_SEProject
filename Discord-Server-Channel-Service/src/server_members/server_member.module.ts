import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMemberService } from './server_member.service';
import { ServerMemberController } from './server_member.controller';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { RoleModule } from '../roles/role.module';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerMember, Server]),
    RoleModule,
    UserModule,
  ],
  providers: [ServerMemberService],
  controllers: [ServerMemberController],
  exports: [ServerMemberService],
})
export class ServerMemberModule {}
