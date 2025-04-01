import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { ChannelMember } from '../channel_members/channel_member.entity';
import { UserService } from '../users/user.service';
import { ChannelMemberService } from '../channel_members/channel_member.service';
import { ChannelDto } from './channel.dto';
import { Client } from '@elastic/elasticsearch';
import { channel } from 'node:diagnostics_channel';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    private userService: UserService,
    private channelMemberService: ChannelMemberService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createChannel(serverId: string, data: ChannelDto, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can create channels');

    const existingChannel = await this.channelRepository.findOne({
      where: { server_id: serverId, name: data.name },
    });
    if (existingChannel)
      throw new Error('Channel with this name already exists in the server');

    const channel = this.channelRepository.create({
      server_id: serverId,
      name: data.name,
      type: data.type || 'text',
      created_at: new Date(),
      is_private: data.is_private || false,
    });

    await this.channelRepository.save(channel);

    await this.channelMemberService.addMember(channel.id, username, {
      username: user.username,
    });

    await this.esClient.index({
      index: 'channels',
      id: channel.id,
      body: {
        server_id: serverId,
        server_name: server.name,
        name: channel.name,
        type: channel.type,
        created_at: channel.created_at,
        is_private: channel.is_private,
        server_pic: server.server_pic,
      },
    });

    return channel;
  }

  async getChannels(username: string, serverId: string, query: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    const result = await this.esClient.search({
      index: 'channels',
      body: {
        query: {
          bool: {
            filter: [{ term: { server_id: server.id } }],
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

    const channels = result.hits.hits.map((hit: any) => hit._source);
    if (channels.length === 0) {
      throw new Error('No channels found');
    }

    return channels;
  }

  async getChannelsByServer(serverId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    const result = await this.esClient.search({
      index: 'channels',
      body: {
        query: {
          term: { server_id: server.id },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async updateChannel(
    channelId: string,
    data: Partial<ChannelDto>,
    username: string,
  ) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) throw new Error('Channel not found');

    if (channel.server.owner_id !== user.id)
      throw new Error('Only the owner can update the channel');

    const updatedData: Partial<Channel> = {
      name: data.name || channel.name,
      type: data.type || channel.type,
      is_private:
        data.is_private !== undefined ? data.is_private : channel.is_private,
    };

    await this.channelRepository.update(channelId, updatedData);

    await this.esClient.update({
      index: 'channels',
      id: channelId,
      body: {
        doc: {
          name: updatedData.name,
          type: updatedData.type,
          is_private: updatedData.is_private,
        },
      },
    });

    return { message: 'Channel updated successfully' };
  }

  async deleteChannel(channelId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) throw new Error('Channel not found');

    if (channel.server.owner_id !== user.id)
      throw new Error('Only the owner can delete the channel');

    await this.channelRepository.delete(channelId);

    await this.esClient.delete({
      index: 'channels',
      id: channelId,
    });

    return { message: 'Channel deleted successfully' };
  }
}
