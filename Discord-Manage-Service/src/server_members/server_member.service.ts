import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { UserService } from '../users/user.service';
import { RoleService } from '../roles/role.service';
import { Client } from '@elastic/elasticsearch';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerMemberDto } from './server_member.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Role } from 'src/roles/role.entity';

@Injectable()
export class ServerMemberService {
  constructor(
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    private userService: UserService,
    private roleService: RoleService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async addMember(serverId: string, username: string, data: ServerMemberDto) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto);
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

    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    let role: Role | null = null;
    if (data.role_id) {
      role = await this.roleService.getRole(data.role_id);
      if (!role) throw new Error('Role not found');
    }

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can add members');

    const memberToAdd = await this.userService.getUserByUsername(data.username);
    if (!memberToAdd) throw new Error('User to add not found');

    const existingMember = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: memberToAdd.id },
    });
    if (existingMember) throw new Error('User is already a member');

    const member = this.serverMemberRepository.create({
      server_id: serverId,
      user_id: memberToAdd.id,
      role_id: data.role_id,
    });

    await this.serverMemberRepository.save(member);

    await this.esClient.index({
      index: 'server_members',
      id: member.id,
      body: {
        server_id: serverId,
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

  // Các phương thức khác giữ nguyên
  async removeMember(serverId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can remove members');

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: user.id },
    });
    if (!member) throw new Error('User is not a member');

    await this.serverMemberRepository.delete(member.id);
    await this.esClient.delete({ index: 'server_members', id: member.id });
    return { message: `${username} removed from server ${server.name}` };
  }

  async updateMemberRole(
    serverId: string,
    username: string,
    data: Partial<ServerMemberDto>,
  ) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto, {
      skipMissingProperties: true,
    });
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

    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    let role: Role | null = null;
    if (data.role_id) {
      role = await this.roleService.getRole(data.role_id);
      if (!role) throw new Error('Role not found');
    }

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can update member roles');

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: user.id },
    });
    if (!member) throw new Error('User is not a member');

    await this.serverMemberRepository.update(member.id, {
      role_id: data.role_id,
    });

    await this.esClient.update({
      index: 'server_members',
      id: member.id,
      body: { doc: { role_name: role ? role.name : null } },
    });

    return {
      message: `Updated role of ${username}${role ? ` to ${role.name}` : ' (role removed)'}`,
    };
  }

  async getMembers(serverId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can view members');

    const members = await this.serverMemberRepository.find({
      where: { server_id: serverId },
      relations: ['user', 'role'],
    });

    for (const member of members) {
      await this.esClient.index({
        index: 'server_members',
        id: member.id,
        body: {
          server_id: serverId,
          server_name: server.name,
          username: member.user.username,
          role_name: member.role ? member.role.name : null,
          profile_pic: member.user.profile_pic,
          joined_at: member.joined_at,
        },
      });
    }

    const result = await this.esClient.search({
      index: 'server_members',
      body: { query: { term: { server_id: serverId } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async searchMember(serverId: string, query: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can search members');

    const result = await this.esClient.search({
      index: 'server_members',
      body: {
        query: {
          bool: {
            filter: [{ term: { server_id: serverId } }],
            must: [
              { query_string: { query: `*${query}*`, fields: ['username'] } },
            ],
          },
        },
      },
    });

    const members = result.hits.hits.map((hit: any) => hit._source);
    if (members.length === 0)
      throw new Error('No members found matching the query');
    return members;
  }

  @GrpcMethod('ServerMemberService', 'AddMember')
  async addMemberGrpc(data: any) {
    const result = await this.addMember(data.server_id, data.username, data);
    return { message: result.message };
  }

  @GrpcMethod('ServerMemberService', 'UpdateMemberRole')
  async updateMemberRoleGrpc(data: any) {
    const result = await this.updateMemberRole(
      data.server_id,
      data.username,
      data,
    );
    return { message: result.message };
  }

  // Các gRPC method khác giữ nguyên
  @GrpcMethod('ServerMemberService', 'RemoveMember')
  async removeMemberGrpc(data: { server_id: string; username: string }) {
    const result = await this.removeMember(data.server_id, data.username);
    return { message: result.message };
  }

  @GrpcMethod('ServerMemberService', 'GetMembers')
  async getMembersGrpc(data: { server_id: string; username: string }) {
    const members = await this.getMembers(data.server_id, data.username);
    return {
      members: members.map((member: any) => this.mapMemberToInfo(member)),
    };
  }

  @GrpcMethod('ServerMemberService', 'SearchMember')
  async searchMemberGrpc(data: {
    server_id: string;
    username: string;
    query: string;
  }) {
    const members = await this.searchMember(
      data.server_id,
      data.query,
      data.username,
    );
    return {
      members: members.map((member: any) => this.mapMemberToInfo(member)),
    };
  }

  private mapMemberToInfo(member: any) {
    return {
      username: member.username,
      role_name: member.role_name || '',
      profile_pic: member.profile_pic || '',
      joined_at: member.joined_at.toISOString(),
    };
  }
}
