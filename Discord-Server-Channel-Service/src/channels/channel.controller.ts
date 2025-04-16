import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelService } from './channel.service';
import { ChannelDto } from './channel.dto';

@Controller()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @GrpcMethod('ChannelService', 'CreateChannel')
  async createChannel(data: { serverId: string; userId: string } & ChannelDto) {
    const result = await this.channelService.createChannel(
      data.serverId,
      data.userId,
      data,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelService', 'GetChannelsByServer')
  async getChannelsByServer(data: {
    serverId: string;
    userId: string;
    query: string;
  }) {
    const channels = await this.channelService.getChannelsByServer(
      data.serverId,
      data.userId,
      data.query,
    );
    return {
      channels: channels.map((channel: any) =>
        this.mapChannelToResponse(channel),
      ),
    };
  }

  @GrpcMethod('ChannelService', 'UpdateChannel')
  async updateChannel(
    data: { channelId: string; userId: string } & Partial<ChannelDto>,
  ) {
    const result = await this.channelService.updateChannel(
      data.channelId,
      data.userId,
      { name: data.name, type: data.type, isPrivate: data.isPrivate },
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelService', 'DeleteChannel')
  async deleteChannel(data: { channelId: string; userId: string }) {
    const result = await this.channelService.deleteChannel(
      data.channelId,
      data.userId,
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
