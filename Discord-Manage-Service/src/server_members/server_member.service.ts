import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { RoleService } from '../roles/role.service';
import { Client } from '@elastic/elasticsearch';
import { ServerMemberDto } from './server_member.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Role } from '../roles/role.entity';

@Injectable()
export class ServerMemberService {
  constructor(
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    private roleService: RoleService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  private user = {
    id: '0000cf74-73b9-494f-90dd-81ca863bbc3c',
    username: 'user7660',
    email: 'user7660@example.dating',
    password_hash:
      '$2b$12$/fScO2Ie4/XNpbMZxa.BlO5p8c0c4v9lYw1HsdS1WNZKAENddcnxW',
    profile_pic: null,
    status: 'online',
    created_at: '2021-06-06 10:57:21',
    updated_at: '2021-06-06 10:57:21',
    is_admin: false,
  };

  async addMember(server_id: string, username: string, data: ServerMemberDto) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== user.id)
      return { message: 'Only the owner can add members' };

    let role: Role | null = null;
    if (data.roleId) {
      role = await this.roleService.getRole(data.roleId);
      if (!role) return { message: 'Role not found' };
    }

    const memberToAdd = this.user;
    if (!memberToAdd) return { message: 'User to add not found' };

    const existingMember = await this.serverMemberRepository.findOne({
      where: { server_id: server_id, user_id: memberToAdd.id },
    });
    if (existingMember) return { message: 'User is already a member' };

    const member = this.serverMemberRepository.create({
      server_id: server_id,
      user_id: memberToAdd.id,
      role_id: data.roleId,
    });

    await this.serverMemberRepository.save(member);

    await this.esClient.index({
      index: 'server_members',
      id: member.id,
      body: {
        server_id: server_id,
        server_name: server.name,
        username: memberToAdd.username,
        role_name: role ? role.name : null,
        profile_pic: memberToAdd.profile_pic,
        joined_at: member.joined_at,
      },
    });

    return {
      message: `${memberToAdd.username} added to server ${server.name}${role ? ` with role ${role.name}` : ''}`,
    };
  }

  async removeMember(
    server_id: string,
    username: string,
    memberUsername: string,
  ) {
    const user = this.user;
    const memberToRemove = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== user.id)
      return { message: 'Only the owner can remove members' };

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: server_id, user_id: memberToRemove.id },
    });
    if (!member) return { message: 'User is not a member' };

    await this.serverMemberRepository.delete(member.id);
    await this.esClient.delete({ index: 'server_members', id: member.id });
    return { message: `${memberUsername} removed from server ${server.name}` };
  }

  async updateMemberRole(
    server_id: string,
    username: string,
    data: ServerMemberDto,
  ) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto, {
      skipMissingProperties: true,
    });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = this.user;
    const memberToUpdate = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== user.id)
      return { message: 'Only the owner can update member roles' };

    let role: Role | null = null;
    if (data.roleId) {
      role = await this.roleService.getRole(data.roleId);
      if (!role) return { message: 'Role not found' };
    }

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: server_id, user_id: memberToUpdate.id },
    });
    if (!member) return { message: 'User is not a member' };

    await this.serverMemberRepository.update(member.id, {
      role_id: data.roleId,
    });

    await this.esClient.update({
      index: 'server_members',
      id: member.id,
      body: { doc: { role_name: role ? role.name : null } },
    });

    return {
      message: `Updated role of ${data.memberUsername}${role ? ` to ${role.name}` : ' (role removed)'}`,
    };
  }

  async getMembers(server_id: string, username: string) {
    const user = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return [];
    if (server.owner_id !== user.id) return [];

    const result = await this.esClient.search({
      index: 'server_members',
      body: { query: { term: { server_id: server_id } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async searchMember(server_id: string, query: string, username: string) {
    const user = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return [];
    if (server.owner_id !== user.id) return [];

    const result = await this.esClient.search({
      index: 'server_members',
      body: {
        query: {
          bool: {
            filter: [{ term: { server_id: server_id } }],
            must: [{ match_phrase_prefix: { username: query } }],
          },
        },
      },
    });

    const members = result.hits.hits.map((hit: any) => hit._source);
    return members;
  }
}
