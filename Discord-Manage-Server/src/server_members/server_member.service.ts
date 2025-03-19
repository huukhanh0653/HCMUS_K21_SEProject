import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { User } from '../users/user.entity';
import { ServerMemberDto } from './server_member.dto';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ServerMemberService {
  constructor(
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async addMember(serverId: string, username: string, data: ServerMemberDto) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.owner_id !== user.id) {
      throw new Error('Only the owner can add members');
    }

    const existingMember = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: user.id },
    });
    if (existingMember) {
      throw new Error('User is already a member');
    }

    const member = this.serverMemberRepository.create({
      server_id: serverId,
      user_id: user.id,
    });

    await this.serverMemberRepository.save(member);

    await this.esClient.index({
      index: 'server_members',
      id: member.id,
      body: {
        server: server.name,
        username: user.username,
        role: data.role,
      },
    });

    return {
      message: `${username} added to server ${server.name} with role ${data.role}`,
    };
  }

  async removeMember(serverId: string, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.owner_id !== user.id) {
      throw new Error('Only the owner can remove members');
    }

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: user.id },
    });
    if (!member) {
      throw new Error('User is not a member');
    }

    await this.serverMemberRepository.delete(member.id);

    await this.esClient.delete({
      index: 'server_members',
      id: member.id,
    });

    return { message: `${username} removed from server ${server.name}` };
  }

  async updateMemberRole(
    serverId: string,
    username: string,
    data: ServerMemberDto,
  ) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.owner_id !== user.id) {
      throw new Error('Only the owner can update member roles');
    }

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: user.id },
    });
    if (!member) {
      throw new Error('User is not a member');
    }

    await this.serverMemberRepository.update(member.id, { role: data.role });

    await this.esClient.update({
      index: 'server_members',
      id: member.id,
      body: {
        doc: { role: data.role },
      },
    });

    return { message: `Updated role of ${username} to ${data.role}` };
  }

  async getMembers(serverId: string, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.owner_id !== user.id) {
      throw new Error('Only the owner can view members');
    }

    const result = await this.esClient.search({
      index: 'server_members',
      body: {
        query: {
          term: { server_id: serverId },
        },
      },
    });

    const members = result.hits.hits.map((hit: any) => hit._source);
    return members;
  }

  async searchMember(serverId: string, query: string, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new Error('Server not found');
    }

    if (server.owner_id !== user.id) {
      throw new Error('Only the owner can search members');
    }

    const result = await this.esClient.search({
      index: 'server_members',
      body: {
        query: {
          bool: {
            filter: [{ term: { server_id: serverId } }],
            must: [
              {
                query_string: {
                  query: `*${query}*`,
                  fields: ['username'],
                },
              },
            ],
          },
        },
      },
    });

    const members = result.hits.hits.map((hit: any) => hit._source);
    if (members.length === 0) {
      throw new Error('No members found matching the query');
    }

    return members;
  }
}
