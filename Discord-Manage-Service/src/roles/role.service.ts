import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';
import { Client } from '@elastic/elasticsearch';
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

  async createRole(server_id: string, data: RoleDto) {
    const roleDto = plainToClass(RoleDto, data);
    const errors = await validate(roleDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };

    const existingRole = await this.roleRepository.findOne({
      where: { server_id, name: data.name },
    });
    if (existingRole)
      return { message: 'Role with this name already exists in the server' };

    const role = this.roleRepository.create({
      server_id: server_id,
      name: data.name,
      color: data.color,
      position: data.position,
      is_default: data.isDefault || false,
    });

    await this.roleRepository.save(role);

    await this.esClient.index({
      index: 'roles',
      id: role.id,
      body: {
        server_id: server_id,
        name: role.name,
        color: role.color,
        position: role.position,
        is_default: role.is_default,
      },
    });

    return { message: 'Role created successfully' };
  }

  async updateRole(roleId: string, data: Partial<RoleDto>) {
    const roleDto = plainToClass(RoleDto, data);
    const errors = await validate(roleDto, { skipMissingProperties: true });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) return { message: 'Role not found' };

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
            data.isDefault !== undefined ? data.isDefault : role.is_default,
        },
      },
    });

    return { message: 'Role updated successfully' };
  }

  async getRole(roleId: string) {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['server'],
    });
    if (!role) return null;
    return role;
  }

  async getRolesByServer(server_id: string) {
    const result = await this.esClient.search({
      index: 'roles',
      body: { query: { term: { server_id: server_id } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async deleteRole(roleId: string) {
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) return { message: 'Role not found' };

    await this.roleRepository.delete(roleId);
    await this.esClient.delete({ index: 'roles', id: roleId });
    return { message: 'Role deleted successfully' };
  }
}
