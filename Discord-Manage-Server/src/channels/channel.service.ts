import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { ServerMember } from '../server_members/server_member.entity';
import { User } from '../users/user.entity';
import { Client } from '@elastic/elasticsearch';
import { ChannelDto } from './channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createChannel(serverId: string, username: string, data: ChannelDto) {
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

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: user.id },
    });
    if (!member || (member.role !== 'admin' && server.owner_id !== user.id)) {
      throw new Error('Permission denied');
    }

    const channel = this.channelRepository.create({
      server_id: serverId,
      name: data.name,
      type: data.type,
    });

    await this.channelRepository.save(channel);

    await this.esClient.index({
      index: 'channels',
      id: channel.id,
      body: {
        server_id: serverId,
        name: channel.name,
        type: channel.type,
      },
    });

    return channel;
  }

  async getChannels(serverId: string) {
    const result = await this.esClient.search({
      index: 'channels',
      body: {
        query: {
          term: { server_id: serverId },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async updateChannel(
    channelId: string,
    username: string,
    data: Partial<ChannelDto>,
  ) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) {
      throw new Error('Channel not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: channel.server_id },
    });
    const member = await this.serverMemberRepository.findOne({
      where: { server_id: channel.server_id, user_id: user.id },
    });
    if (!member || (member.role !== 'admin' && server!.owner_id !== user.id)) {
      throw new Error('Permission denied');
    }

    await this.channelRepository.update(channelId, data);

    await this.esClient.update({
      index: 'channels',
      id: channelId,
      body: {
        doc: { name: data.name, type: data.type },
      },
    });

    return { message: 'Channel updated successfully' };
  }

  async deleteChannel(channelId: string, username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) {
      throw new Error('Channel not found');
    }

    const server = await this.serverRepository.findOne({
      where: { id: channel.server_id },
    });
    const member = await this.serverMemberRepository.findOne({
      where: { server_id: channel.server_id, user_id: user.id },
    });
    if (!member || (member.role !== 'admin' && server!.owner_id !== user.id)) {
      throw new Error('Permission denied');
    }

    await this.channelRepository.delete(channelId);

    await this.esClient.delete({
      index: 'channels',
      id: channelId,
    });

    return { message: 'Channel deleted successfully' };
  }
}
