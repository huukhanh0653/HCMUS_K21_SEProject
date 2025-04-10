import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { ChannelMemberService } from '../channel_members/channel_member.service';
import { Client } from '@elastic/elasticsearch';
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
    private channelMemberService: ChannelMemberService,
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

  async createChannel(server_id: string, username: string, data: ChannelDto) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== user.id)
      return { message: 'Only the owner can update the channel' };

    const existingChannel = await this.channelRepository.findOne({
      where: { server_id, name: data.name },
    });
    if (existingChannel)
      return { message: 'Channel with this name already exists in the server' };

    const channel = this.channelRepository.create({
      server_id: server_id,
      name: data.name,
      type: data.type || 'text',
      is_private: data.isPrivate || false,
    });

    await this.channelRepository.save(channel);

    await this.channelMemberService.addMember(channel.id, username, username);

    await this.esClient.index({
      index: 'channels',
      id: channel.id,
      body: {
        server_id: server_id,
        server_name: server.name,
        name: channel.name,
        type: channel.type,
        created_at: channel.created_at,
        is_private: channel.is_private,
        server_pic: server.server_pic,
      },
    });

    return { message: 'Channel created successfully' };
  }

  async updateChannel(
    channelId: string,
    data: Partial<ChannelDto>,
    username: string,
  ) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto, { skipMissingProperties: true });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = this.user;
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== user.id)
      return { message: 'Only the owner can update the channel' };

    const updatedData = {
      name: data.name || channel.name,
      type: data.type || channel.type,
      is_private:
        data.isPrivate !== undefined ? data.isPrivate : channel.is_private,
    };

    await this.channelRepository.update(channelId, updatedData);

    await this.esClient.update({
      index: 'channels',
      id: channelId,
      body: { doc: updatedData },
    });

    return { message: 'Channel updated successfully' };
  }

  async getChannels(username: string, server_id: string, query: string) {
    const user = this.user;
    if (!user) return [];

    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return [];

    const result = await this.esClient.search({
      index: 'channels',
      body: {
        query: {
          bool: {
            filter: [{ term: { server_id: server.id } }],
            must: [{ match_phrase_prefix: { name: query } }],
          },
        },
      },
    });

    const channels = result.hits.hits.map((hit: any) => hit._source);
    return channels;
  }

  async getChannelsByServer(server_id: string, username: string) {
    const user = this.user;
    if (!user) return [];

    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return [];

    const result = await this.esClient.search({
      index: 'channels',
      body: { query: { term: { server_id: server.id } } },
    });

    const channels = result.hits.hits.map((hit: any) => hit._source);
    return channels;
  }

  async deleteChannel(channelId: string, username: string) {
    const user = this.user;
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== user.id)
      return { message: 'Only the owner can delete the channel' };

    await this.channelRepository.delete(channelId);
    await this.esClient.delete({ index: 'channels', id: channelId });
    return { message: 'Channel deleted successfully' };
  }
}
