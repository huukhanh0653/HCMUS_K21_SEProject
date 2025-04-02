import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Server])],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
