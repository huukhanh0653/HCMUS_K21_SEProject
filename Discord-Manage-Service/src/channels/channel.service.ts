import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { UserService } from '../users/user.service';
import { ChannelMemberService } from '../channel_members/channel_member.service';
import { Client } from '@elastic/elasticsearch';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelDto } from './channel.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
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
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto);
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
      type: data.type,
      is_private: data.is_private,
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

  async updateChannel(
    channelId: string,
    data: Partial<ChannelDto>,
    username: string,
  ) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto, { skipMissingProperties: true });
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

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) throw new Error('Channel not found');

    if (channel.server.owner_id !== user.id)
      throw new Error('Only the owner can update the channel');

    const updatedData = {
      name: data.name || channel.name,
      type: data.type || channel.type,
      is_private:
        data.is_private !== undefined ? data.is_private : channel.is_private,
    };

    await this.channelRepository.update(channelId, updatedData);

    await this.esClient.update({
      index: 'channels',
      id: channelId,
      body: { doc: updatedData },
    });

    return { message: 'Channel updated successfully' };
  }

  // Các phương thức khác giữ nguyên
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
            must: [{ query_string: { query: `*${query}*`, fields: ['name'] } }],
          },
        },
      },
    });

    const channels = result.hits.hits.map((hit: any) => hit._source);
    if (channels.length === 0) throw new Error('No channels found');
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
      body: { query: { term: { server_id: server.id } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
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
    await this.esClient.delete({ index: 'channels', id: channelId });
    return { message: 'Channel deleted successfully' };
  }

  @GrpcMethod('ChannelService', 'CreateChannel')
  async createChannelGrpc(data: any) {
    const channel = await this.createChannel(
      data.server_id,
      data,
      data.username,
    );
    return this.mapChannelToResponse(channel);
  }

  @GrpcMethod('ChannelService', 'UpdateChannel')
  async updateChannelGrpc(data: any) {
    const result = await this.updateChannel(
      data.channel_id,
      data,
      data.username,
    );
    return { message: result.message };
  }

  // Các gRPC method khác giữ nguyên
  @GrpcMethod('ChannelService', 'GetChannels')
  async getChannelsGrpc(data: {
    username: string;
    server_id: string;
    query: string;
  }) {
    const channels = await this.getChannels(
      data.username,
      data.server_id,
      data.query,
    );
    return {
      channels: channels.map((channel: any) =>
        this.mapChannelToResponse(channel),
      ),
    };
  }

  @GrpcMethod('ChannelService', 'GetChannelsByServer')
  async getChannelsByServerGrpc(data: { server_id: string; username: string }) {
    const channels = await this.getChannelsByServer(
      data.server_id,
      data.username,
    );
    return {
      channels: channels.map((channel: any) =>
        this.mapChannelToResponse(channel),
      ),
    };
  }

  @GrpcMethod('ChannelService', 'DeleteChannel')
  async deleteChannelGrpc(data: { channel_id: string; username: string }) {
    const result = await this.deleteChannel(data.channel_id, data.username);
    return { message: result.message };
  }

  private mapChannelToResponse(channel: any) {
    return {
      id: channel.id,
      server_id: channel.server_id,
      name: channel.name,
      type: channel.type || '',
      created_at: channel.created_at.toISOString(),
      is_private: channel.is_private || false,
    };
  }
}
