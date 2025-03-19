import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { User } from '../users/user.entity';
import { ServerMemberService } from '../server_members/server_member.service';
import { ChannelService } from '../channels/channel.service';
import { Client } from '@elastic/elasticsearch';
import { ServerDto } from './server.dto';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private serverMemberService: ServerMemberService,
    private channelService: ChannelService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createServer(ownerUsername: string, data: ServerDto) {
    const owner = await this.userRepository.findOne({
      where: { username: ownerUsername },
    });
    if (!owner) {
      throw new Error('Owner not found');
    }

    const server = this.serverRepository.create({
      name: data.name,
      owner_id: owner.id,
    });

    await this.serverRepository.save(server);

    await this.serverMemberService.addMember(server.id, ownerUsername, {
      role: 'admin',
    });

    await this.esClient.index({
      index: 'servers',
      id: server.id,
      body: {
        name: server.name,
        owner_username: owner.username,
      },
    });

    return server;
  }

  async getServers(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.esClient.search({
      index: 'servers',
      body: {
        query: {
          term: { owner_username: username },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async updateServer(
    serverId: string,
    username: string,
    data: Partial<ServerDto>,
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
      throw new Error('Only the owner can update the server');
    }

    await this.serverRepository.update(serverId, data);

    await this.esClient.update({
      index: 'servers',
      id: serverId,
      body: {
        doc: { name: data.name },
      },
    });

    return { message: 'Server updated successfully' };
  }

  async deleteServer(serverId: string, username: string) {
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
      throw new Error('Only the owner can delete the server');
    }

    const members = await this.serverMemberService.getMembers(
      serverId,
      username,
    );
    for (const member of members) {
      await this.serverMemberService.removeMember(serverId, member.username);
    }

    const channels = await this.channelService.getChannels(serverId);
    for (const channel of channels) {
      await this.channelService.deleteChannel(channel.id, username);
    }

    await this.serverRepository.delete(serverId);

    await this.esClient.delete({
      index: 'servers',
      id: serverId,
    });

    return { message: 'Server deleted successfully' };
  }

  async searchServer(username: string, query: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.esClient.search({
      index: 'servers',
      body: {
        query: {
          bool: {
            filter: [{ term: { owner_username: username } }],
            must: [
              {
                query_string: {
                  query: `*${query}*`,
                  fields: ['name'],
                },
              },
            ],
          },
        },
      },
    });

    const servers = result.hits.hits.map((hit: any) => hit._source);
    if (servers.length === 0) {
      throw new Error('No servers found');
    }

    return servers;
  }
}
