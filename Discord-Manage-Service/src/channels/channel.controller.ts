import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelService } from './channel.service';
import { ChannelDto } from './channel.dto';

@Controller()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @GrpcMethod('ChannelService', 'CreateChannel')
  async createChannel(
    data: { serverId: string; username: string } & ChannelDto,
  ) {
    const result = await this.channelService.createChannel(
      data.serverId,
      data.username,
      data,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelService', 'GetChannels')
  async getChannels(data: {
    username: string;
    server_id: string;
    query: string;
  }) {
    const channels = await this.channelService.getChannels(
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
  async getChannelsByServer(data: { serverId: string; username: string }) {
    const channels = await this.channelService.getChannelsByServer(
      data.serverId,
      data.username,
    );
    return {
      channels: channels.map((channel: any) =>
        this.mapChannelToResponse(channel),
      ),
    };
  }

  @GrpcMethod('ChannelService', 'UpdateChannel')
  async updateChannel(
    data: { channelId: string; username: string } & Partial<ChannelDto>,
  ) {
    const result = await this.channelService.updateChannel(
      data.channelId,
      data,
      data.username,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelService', 'DeleteChannel')
  async deleteChannel(data: { channelId: string; username: string }) {
    const result = await this.channelService.deleteChannel(
      data.channelId,
      data.username,
    );
    return { message: result.message };
  }

  private mapChannelToResponse(channel: any) {
    return {
      id: channel.id,
      serverId: channel.server_id,
      name: channel.name,
      type: channel.type || '',
      createdAt: channel.created_at,
      isPrivate: channel.is_private || false,
      message: channel.message || '',
    };
  }
}
