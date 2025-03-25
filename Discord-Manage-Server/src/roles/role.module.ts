import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { ServerModule } from '../servers/server.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Server]), ServerModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
