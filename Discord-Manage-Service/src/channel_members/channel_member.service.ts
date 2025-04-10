import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ChannelMemberService {
  constructor(
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
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

  async addMember(
    channelId: string,
    username: string,
    member_username: string,
  ) {
    const user = this.user;
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== user.id)
      return { message: 'Only the owner can add members' };

    const memberToAdd = this.user;
    if (!memberToAdd) return { message: 'User to add not found' };

    const existingMember = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberToAdd.id },
    });
    if (existingMember)
      return { message: 'User is already a member of this channel' };

    const member = this.channelMemberRepository.create({
      channel_id: channelId,
      user_id: memberToAdd.id,
    });

    await this.channelMemberRepository.save(member);

    await this.esClient.index({
      index: 'channel_members',
      id: member.id,
      body: {
        channel_id: channelId,
        channel_name: channel.name,
        username: memberToAdd.username,
        profile_pic: memberToAdd.profile_pic,
        created_at: member.created_at,
      },
    });

    return {
      message: `${memberToAdd.username} added to channel ${channel.name}`,
    };
  }

  async removeMember(
    channelId: string,
    username: string,
    memberUsername: string,
  ) {
    const user = this.user;
    const memberToRemove = this.user;
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== user.id)
      return { message: 'Only the owner can remove members' };

    const member = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberToRemove.id },
    });
    if (!member) return { message: 'User is not a member of this channel' };

    await this.channelMemberRepository.delete(member.id);
    await this.esClient.delete({ index: 'channel_members', id: member.id });
    return {
      message: `${memberToRemove.username} removed from channel ${channel.name}`,
    };
  }

  async getMembers(channelId: string, username: string) {
    const user = this.user;
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return [];
    if (channel.server.owner_id !== user.id) return [];
    const result = await this.esClient.search({
      index: 'channel_members',
      body: { query: { term: { channel_id: channelId } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async searchMember(channelId: string, query: string, username: string) {
    const user = this.user;
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return [];
    if (channel.server.owner_id !== user.id) return [];

    const result = await this.esClient.search({
      index: 'channel_members',
      body: {
        query: {
          bool: {
            filter: [{ term: { channel_id: channelId } }],
            must: [{ match_phrase_prefix: { username: query } }],
          },
        },
      },
    });

    const members = result.hits.hits.map((hit: any) => hit._source);
    return members;
  }
}
