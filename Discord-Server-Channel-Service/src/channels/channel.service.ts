import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { ChannelMemberService } from '../channel_members/channel_member.service';
import { ChannelDto } from './channel.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ChannelMember } from 'src/channel_members/channel_member.entity';
import { ServerMemberService } from 'src/server_members/server_member.service';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    private serverMemberService: ServerMemberService,
    private channelMemberService: ChannelMemberService,
  ) {}

  async createChannel(serverId: string, userId: string, data: ChannelDto) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto);
    if (errors.length > 0)
      return { message: `Validation failed: ${errors}`, channel: {} };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };

    const server_member = await this.serverMemberService.getMemberById(
      serverId,
      userId,
    );
    if (!server_member)
      return {
        message: 'Only the members of the server can create channel',
        channel: {},
      };

    const existingChannel = await this.channelRepository.findOne({
      where: { server_id: serverId, name: data.name },
    });
    if (existingChannel)
      return {
        message: 'Channel with this name already exists in the server',
        channel: {},
      };

    const channel = this.channelRepository.create({
      server_id: serverId,
      name: data.name,
      type: data.type,
      is_private: data.isPrivate,
    });

    await this.channelRepository.save(channel);
    await this.channelMemberService.addMember(channel.id, userId);

    return { message: 'Channel created successfully', channel };
  }

  async updateChannel(channelId: string, userId: string, data: ChannelDto) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto, { skipMissingProperties: true });
    if (errors.length > 0)
      return { message: `Validation failed: ${errors}`, channel: {} };

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };

    const server_member = await this.serverMemberService.getMemberById(
      channel.server_id,
      userId,
    );
    if (!server_member)
      return {
        message: 'Only the members of the server can create channel',
        channel: {},
      };

    const updatedData = {
      name: data.name || channel.name,
      type: data.type || channel.type,
      is_private:
        data.isPrivate !== undefined ? data.isPrivate : channel.is_private,
    };

    await this.channelRepository.update(channelId, updatedData);

    return { message: 'Channel updated successfully', channel: updatedData };
  }

  async getChannelsByServer(serverId: string, query: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found', channels: [] };

    const channels = await this.channelRepository.find({
      where: { server_id: serverId, name: Like(`%${query}%`) },
    });

    return { message: 'Get channels successfully', channels };
  }

  async deleteChannel(channelId: string, userId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return { message: 'Channel not found' };

    const server_member = await this.serverMemberService.getMemberById(
      channel.server_id,
      userId,
    );
    if (!server_member)
      return { message: 'Only the members of the server can create channel' };

    await this.channelMemberRepository.delete({ channel_id: channelId });
    await this.channelRepository.delete({ id: channelId });

    return { message: 'Channel deleted successfully' };
  }
}
