import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';
import { RoleDto } from './role.dto';
import { Client } from '@elastic/elasticsearch';

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
      body: {
        query: {
          term: { server_id: serverId },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async updateRole(roleId: string, data: Partial<RoleDto>) {
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

  async deleteRole(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new Error('Role not found');

    await this.roleRepository.delete(roleId);

    await this.esClient.delete({
      index: 'roles',
      id: roleId,
    });

    return { message: 'Role deleted successfully' };
  }
}
