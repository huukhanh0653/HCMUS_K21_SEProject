import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelMemberService } from './channel_member.service';

@Controller()
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  @GrpcMethod('ChannelMemberService', 'AddMember')
  async addMember(data: {
    channelId: string;
    username: string;
    memberUsername: string;
  }) {
    const result = await this.channelMemberService.addMember(
      data.channelId,
      data.username,
      data.memberUsername,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelMemberService', 'RemoveMember')
  async removeMember(data: {
    channelId: string;
    username: string;
    memberUsername: string;
  }) {
    const result = await this.channelMemberService.removeMember(
      data.channelId,
      data.username,
      data.memberUsername,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelMemberService', 'GetMembers')
  async getMembers(data: { channelId: string; username: string }) {
    const members = await this.channelMemberService.getMembers(
      data.channelId,
      data.username,
    );
    return {
      members: members.map((member: any) => this.mapMemberToInfo(member)),
    };
  }

  @GrpcMethod('ChannelMemberService', 'SearchMember')
  async searchMember(data: {
    channelId: string;
    username: string;
    query: string;
  }) {
    const members = await this.channelMemberService.searchMember(
      data.channelId,
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
      profilePic: member.profile_pic || '',
      createdAt: member.created_at,
    };
  }
}
