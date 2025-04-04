import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';
import { UserService } from '../users/user.service';
import { Client } from '@elastic/elasticsearch';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelMemberDto } from './channel_member.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ChannelMemberService {
  constructor(
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private userService: UserService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async addMember(channelId: string, username: string, data: ChannelMemberDto) {
    const channelMemberDto = plainToClass(ChannelMemberDto, data);
    const errors = await validate(channelMemberDto);
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
      throw new Error('Only the owner can add members');

    const memberToAdd = await this.userService.getUserByUsername(data.username);
    if (!memberToAdd) throw new Error('User to add not found');

    const existingMember = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberToAdd.id },
    });
    if (existingMember)
      throw new Error('User is already a member of this channel');

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

  // Các phương thức khác giữ nguyên
  async removeMember(
    channelId: string,
    username: string,
    memberUsername: string,
  ) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const memberToRemove =
      await this.userService.getUserByUsername(memberUsername);
    if (!memberToRemove) throw new Error('User to remove not found');

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) throw new Error('Channel not found');

    if (channel.server.owner_id !== user.id)
      throw new Error('Only the owner can remove members');

    const member = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberToRemove.id },
    });
    if (!member) throw new Error('User is not a member of this channel');

    await this.channelMemberRepository.delete(member.id);
    await this.esClient.delete({ index: 'channel_members', id: member.id });
    return {
      message: `${memberToRemove.username} removed from channel ${channel.name}`,
    };
  }

  async getMembers(channelId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) throw new Error('Channel not found');

    if (channel.server.owner_id !== user.id)
      throw new Error('Only the owner can view members');

    const members = await this.channelMemberRepository.find({
      where: { channel_id: channelId },
      relations: ['user'],
    });

    for (const member of members) {
      await this.esClient.index({
        index: 'channel_members',
        id: member.id,
        body: {
          channel_id: channelId,
          channel_name: channel.name,
          username: member.user.username,
          profile_pic: member.user.profile_pic,
          created_at: member.created_at,
        },
      });
    }

    const result = await this.esClient.search({
      index: 'channel_members',
      body: { query: { term: { channel_id: channelId } } },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async searchMember(channelId: string, query: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) throw new Error('Channel not found');

    if (channel.server.owner_id !== user.id)
      throw new Error('Only the owner can search members');

    const result = await this.esClient.search({
      index: 'channel_members',
      body: {
        query: {
          bool: {
            filter: [{ term: { channel_id: channelId } }],
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

  @GrpcMethod('ChannelMemberService', 'AddMember')
  async addMemberGrpc(data: {
    channel_id: string;
    username: string;
    member_username: string;
  }) {
    const result = await this.addMember(data.channel_id, data.username, {
      username: data.member_username,
    });
    return { message: result.message };
  }

  // Các gRPC method khác giữ nguyên
  @GrpcMethod('ChannelMemberService', 'RemoveMember')
  async removeMemberGrpc(data: {
    channel_id: string;
    username: string;
    member_username: string;
  }) {
    const result = await this.removeMember(
      data.channel_id,
      data.username,
      data.member_username,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelMemberService', 'GetMembers')
  async getMembersGrpc(data: { channel_id: string; username: string }) {
    const members = await this.getMembers(data.channel_id, data.username);
    return {
      members: members.map((member: any) => this.mapMemberToInfo(member)),
    };
  }

  @GrpcMethod('ChannelMemberService', 'SearchMember')
  async searchMemberGrpc(data: {
    channel_id: string;
    username: string;
    query: string;
  }) {
    const members = await this.searchMember(
      data.channel_id,
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
      profile_pic: member.profile_pic || '',
      created_at: member.created_at.toISOString(),
    };
  }
}
