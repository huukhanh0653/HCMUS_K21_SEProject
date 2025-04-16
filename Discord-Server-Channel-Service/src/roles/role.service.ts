import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';
import { RoleDto } from './role.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
  ) {}

  async createRole(serverId: string, data: Partial<RoleDto>) {
    const roleDto = plainToClass(RoleDto, data);
    const errors = await validate(roleDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };

    const existingRole = await this.roleRepository.findOne({
      where: { server_id: serverId, name: data.name },
    });
    if (existingRole)
      return { message: 'Role with this name already exists in the server' };

    const role = this.roleRepository.create({
      server_id: serverId,
      name: data.name,
      color: data.color,
      position: data.position,
      is_default: data.isDefault,
    });

    await this.roleRepository.save(role);

    return { message: 'Role created successfully' };
  }

  async updateRole(roleId: string, data: Partial<RoleDto>) {
    const roleDto = plainToClass(RoleDto, data);
    const errors = await validate(roleDto, { skipMissingProperties: true });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const role = await this.getRoleById(roleId);
    if (!role) return { message: 'Role not found' };

    await this.roleRepository.update(roleId, data);

    return { message: 'Role updated successfully' };
  }

  async getRoleById(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    return role;
  }

  async getRoleByName(serverId: string, name: string) {
    const role = await this.roleRepository.findOne({
      where: { server_id: serverId, name },
    });
    return role;
  }

  async getRolesByServer(serverId: string) {
    const roles = await this.roleRepository.find({
      where: { server_id: serverId },
    });
    return roles;
  }

  async deleteRole(roleId: string) {
    const role = await this.getRoleById(roleId);
    if (!role) return { message: 'Role not found' };

    await this.roleRepository.delete(roleId);

    return { message: 'Role deleted successfully' };
  }
}
