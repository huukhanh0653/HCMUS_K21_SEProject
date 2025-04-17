import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { Server } from 'src/servers/server.entity';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Server])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
