import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { Server } from './server.entity';
import { UserModule } from 'src/users/user.module';
import { ServerMemberModule } from 'src/server_members/server_member.module';
import { RoleModule } from 'src/roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Server]),
    UserModule,
    ServerMemberModule,
    RoleModule,
  ],
  providers: [ServerService],
  controllers: [ServerController],
})
export class ServerModule {}
