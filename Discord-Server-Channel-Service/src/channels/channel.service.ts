import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { UserService } from 'src/users/user.service';
import { ChannelMemberService } from '../channel_members/channel_member.service';
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
  ) {}

  async createChannel(serverId: string, userId: string, data: ChannelDto) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can create the channel' };

    const existingChannel = await this.channelRepository.findOne({
      where: { server_id: serverId, name: data.name },
    });
    if (existingChannel)
      return { message: 'Channel with this name already exists in the server' };

    const channel = this.channelRepository.create({
      server_id: serverId,
      name: data.name,
      type: data.type,
      is_private: data.isPrivate,
    });

    await this.channelRepository.save(channel);
    await this.channelMemberService.addMember(channel.id, userId, userId);

    return { message: 'Channel created successfully' };
  }

  async updateChannel(
    channelId: string,
    userId: string,
    data: Partial<ChannelDto>,
  ) {
    const channelDto = plainToClass(ChannelDto, data);
    const errors = await validate(channelDto, { skipMissingProperties: true });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== userId)
      return { message: 'Only the owner can update the channel' };

    const updatedData = {
      name: data.name || channel.name,
      type: data.type || channel.type,
      is_private:
        data.isPrivate !== undefined ? data.isPrivate : channel.is_private,
    };

    await this.channelRepository.update(channelId, updatedData);

    return { message: 'Channel updated successfully' };
  }

  async getChannelsByServer(serverId: string, userId: string, query: string) {
    const user = await this.userService.getUser(userId);
    if (!user) return [];

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return [];

    const channels = await this.channelRepository.find({
      where: { server_id: serverId, name: Like(`%${query}%`) },
    });

    return channels;
  }

  async deleteChannel(channelId: string, userId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== userId)
      return { message: 'Only the owner can delete the channel' };

    await this.channelRepository.delete(channelId);

    return { message: 'Channel deleted successfully' };
  }
}
