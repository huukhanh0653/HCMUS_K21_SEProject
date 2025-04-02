import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';
import { Client } from '@elastic/elasticsearch';
import { GrpcMethod } from '@nestjs/microservices';
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
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createRole(serverId: string, data: RoleDto) {
    const roleDto = plainToClass(RoleDto, data);
    const errors = await validate(roleDto);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) =>
            e.constraints
              ? Object.values(e.constraints).join(', ')
              : 'Unknown error',
          )
          .join('; ')}`,
      );
    }

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    const existingRole = await this.roleRepository.findOne({
      where: { server_id: serverId, name: data.name },
    });
    if (existingRole)
      throw new Error('Role with this name already exists in the server');

    const role = this.roleRepository.create({
      server_id: serverId,
      name: data.name,
      color: data.color,
      position: data.position,
      is_default: data.is_default || false,
    });

    await this.roleRepository.save(role);

    await this.esClient.index({
      index: 'roles',
      id: role.id,
      body: {
        server_id: serverId,
        name: role.name,
        color: role.color,
        position: role.position,
        is_default: role.is_default,
      },
    });

    return role;
  }

  async updateRole(roleId: string, data: Partial<RoleDto>) {
    const roleDto = plainToClass(RoleDto, data);
    const errors = await validate(roleDto, { skipMissingProperties: true });
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) =>
            e.constraints
              ? Object.values(e.constraints).join(', ')
              : 'Unknown error',
          )
          .join('; ')}`,
      );
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    await this.roleRepository.update(roleId, data);

    await this.esClient.update({
      index: 'roles',
      id: roleId,
      body: {
        doc: {
          name: data.name || role.name,
          color: data.color || role.color,
          position: data.position || role.position,
          is_default:
            data.is_default !== undefined ? data.is_default : role.is_default,
        },
      },
    });

    return { message: 'Role updated successfully' };
  }

  // Các phương thức khác giữ nguyên
  async getRole(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['server'],
    });
    if (!role) throw new Error('Role not found');
    return role;
  }

  async getRolesByServer(serverId: string) {
    const roles = await this.roleRepository.find({
      where: { server_id: serverId },
      relations: ['server'],
    });

    for (const role of roles) {
      await this.esClient.index({
        index: 'roles',
        id: role.id,
        body: {
          server_id: serverId,
          name: role.name,
          color: role.color,
          position: role.position,
          is_default: role.is_default,
        },
      });
    }

    const result = await this.esClient.search({
      index: 'roles',
      body: { query: { term: { server_id: serverId } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async deleteRole(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    await this.roleRepository.delete(roleId);
    await this.esClient.delete({ index: 'roles', id: roleId });
    return { message: 'Role deleted successfully' };
  }

  @GrpcMethod('RoleService', 'CreateRole')
  async createRoleGrpc(data: any) {
    const role = await this.createRole(data.server_id, data);
    return this.mapRoleToResponse(role);
  }

  @GrpcMethod('RoleService', 'UpdateRole')
  async updateRoleGrpc(data: any) {
    const result = await this.updateRole(data.role_id, data);
    return { message: result.message };
  }

  // Các gRPC method khác giữ nguyên
  @GrpcMethod('RoleService', 'GetRole')
  async getRoleGrpc(data: { role_id: string }) {
    const role = await this.getRole(data.role_id);
    return this.mapRoleToResponse(role);
  }

  @GrpcMethod('RoleService', 'GetRolesByServer')
  async getRolesByServerGrpc(data: { server_id: string }) {
    const roles = await this.getRolesByServer(data.server_id);
    return { roles: roles.map((role: any) => this.mapRoleToResponse(role)) };
  }

  @GrpcMethod('RoleService', 'DeleteRole')
  async deleteRoleGrpc(data: { role_id: string }) {
    const result = await this.deleteRole(data.role_id);
    return { message: result.message };
  }

  private mapRoleToResponse(role: any) {
    return {
      id: role.id,
      server_id: role.server_id,
      name: role.name,
      color: role.color || '',
      position: role.position || 0,
      is_default: role.is_default || false,
    };
  }
}
