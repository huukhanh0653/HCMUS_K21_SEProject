import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { Server } from './server.entity';
import { ServerMember } from 'src/server_members/server_member.entity';
import { Role } from 'src/roles/role.entity';
import { UserModule } from 'src/users/user.module';
import { ServerMemberModule } from 'src/server_members/server_member.module';
import { RoleModule } from 'src/roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Server, ServerMember, Role]),
    UserModule,
    ServerMemberModule,
    RoleModule,
  ],
  controllers: [ServerController],
  providers: [ServerService],
  exports: [ServerService],
})
export class ServerModule {}
