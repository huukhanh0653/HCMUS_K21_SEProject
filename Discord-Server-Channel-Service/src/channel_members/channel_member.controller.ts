import { Controller, Post, Get, Delete, Query, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelMemberService } from './channel_member.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('channel-members')
@ApiBearerAuth()
@Controller('channel-members/:channelId')
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  // gRPC Methods
  @GrpcMethod('ChannelMemberService', 'AddMember')
  async addMember(data: { channelId: string; memberId: string }) {
    const response = await this.channelMemberService.addMember(
      data.channelId,
      data.memberId,
    );
    return { ...response };
  }

  @GrpcMethod('ChannelMemberService', 'RemoveMember')
  async removeMember(data: { channelId: string; memberId: string }) {
    const message = await this.channelMemberService.removeMember(
      data.channelId,
      data.memberId,
    );
    return { message };
  }

  @GrpcMethod('ChannelMemberService', 'SearchMember')
  async searchMember(data: { channelId: string; query: string }) {
    const { message, members } = await this.channelMemberService.searchMember(
      data.channelId,
      data.query,
    );
    return {
      message,
      members: members.map((member: any) => this.mapMemberToInfo(member)),
    };
  }

  private mapMemberToInfo(member: any) {
    return { ...member };
  }

  // RESTful Methods
  @Post(':memberId')
  @ApiOperation({ summary: 'Add a member to a channel' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel',
  })
  @ApiParam({
    name: 'memberId',
    description: 'ID of the member to add',
  })
  async addMemberRest(
    @Param('channelId') channelId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.channelMemberService.addMember(channelId, memberId);
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member from a channel' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Member or channel not found' })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel',
  })
  @ApiParam({
    name: 'memberId',
    description: 'ID of the member to add',
  })
  async removeMemberRest(
    @Param('channelId') channelId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.channelMemberService.removeMember(channelId, memberId);
  }

  @Get()
  @ApiOperation({ summary: 'Search members in a channel' })
  @ApiResponse({ status: 200, description: 'List of members' })
  @ApiParam({
    name: 'channelId',
    description: 'ID of the channel',
  })
  @ApiQuery({
    name: 'query',
    description: 'Query string to filter channels by name',
    required: false,
  })
  async searchMemberRest(
    @Param('channelId') channelId: string,
    @Query('query') query: string = '',
  ) {
    return this.channelMemberService.searchMember(channelId, query);
  }
}
