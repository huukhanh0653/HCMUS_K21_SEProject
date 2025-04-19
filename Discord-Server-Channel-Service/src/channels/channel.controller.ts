import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelService } from './channel.service';
import { ChannelDto } from './channel.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('channels')
@ApiBearerAuth()
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  // gRPC Methods
  @GrpcMethod('ChannelService', 'CreateChannel')
  async createChannel(data: { serverId: string; userId: string } & ChannelDto) {
    const response = await this.channelService.createChannel(
      data.serverId,
      data.userId,
      data,
    );
    return { ...response };
  }

  @GrpcMethod('ChannelService', 'GetChannelsByServer')
  async getChannelsByServer(data: { userId: string; query: string }) {
    const { message, channels } = await this.channelService.getChannelsByServer(
      data.userId,
      data.query,
    );
    return {
      message,
      channels: channels.map((channel: any) =>
        this.mapChannelToResponse(channel),
      ),
    };
  }

  @GrpcMethod('ChannelService', 'GetChannels')
  async getChannels(data: { userId: string; query: string }) {
    const { message, channels } = await this.channelService.getChannels(
      data.userId,
      data.query,
    );
    return {
      message,
      channels: channels.map((channel: any) =>
        this.mapChannelToResponse(channel),
      ),
    };
  }

  @GrpcMethod('ChannelService', 'UpdateChannel')
  async updateChannel(
    data: { channelId: string; userId: string } & ChannelDto,
  ) {
    const response = await this.channelService.updateChannel(
      data.channelId,
      data.userId,
      { name: data.name, type: data.type, isPrivate: data.isPrivate },
    );
    return { ...response };
  }

  @GrpcMethod('ChannelService', 'DeleteChannel')
  async deleteChannel(data: { channelId: string; userId: string }) {
    const message = await this.channelService.deleteChannel(
      data.channelId,
      data.userId,
    );
    return { message };
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

  // RESTful Methods
  @Post(':userId/:serverId')
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiResponse({ status: 201, description: 'Channel created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async createChannelRest(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
    @Body() data: ChannelDto,
  ) {
    return this.channelService.createChannel(serverId, userId, data);
  }

  @Get(':serverId/all')
  @ApiOperation({ summary: 'Get channels in a server' })
  @ApiResponse({ status: 200, description: 'List of channels' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  @ApiQuery({
    name: 'query',
    description: 'Query string to filter channels by name',
    required: false,
  })
  async getChannelsByServerRest(
    @Param('serverId') serverId: string,
    @Query('query') query: string = '',
  ) {
    return this.channelService.getChannelsByServer(serverId, query);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get channels the user belongs to' })
  @ApiResponse({ status: 200, description: 'List of channels' })
  @ApiParam({
    name: 'userId',
    description: 'ID of the user',
  })
  @ApiQuery({
    name: 'query',
    description: 'Query string to filter channels by name',
    required: false,
  })
  async getChannelsRest(
    @Param('userId') userId: string,
    @Query('query') query: string = '',
  ) {
    return this.channelService.getChannels(userId, query);
  }

  @Put(':userId/:channelId')
  @ApiOperation({ summary: 'Update a channel' })
  @ApiResponse({ status: 200, description: 'Channel updated successfully' })
  @ApiResponse({ status: 500, description: 'Channel not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel',
  })
  async updateChannelRest(
    @Param('userId') userId: string,
    @Param('channelId') channelId: string,
    @Body() data: ChannelDto,
  ) {
    return this.channelService.updateChannel(channelId, userId, data);
  }

  @Delete(':userId/:channelId')
  @ApiOperation({ summary: 'Delete a channel' })
  @ApiResponse({ status: 200, description: 'Channel deleted successfully' })
  @ApiResponse({ status: 500, description: 'Channel not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel',
  })
  async deleteChannelRest(
    @Param('userId') userId: string,
    @Param('channelId') channelId: string,
  ) {
    return this.channelService.deleteChannel(channelId, userId);
  }
}
