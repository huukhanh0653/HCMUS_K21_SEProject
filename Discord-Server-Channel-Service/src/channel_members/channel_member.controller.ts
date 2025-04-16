import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChannelMemberService } from './channel_member.service';

@Controller()
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  @GrpcMethod('ChannelMemberService', 'AddMember')
  async addMember(data: {
    channelId: string;
    userId: string;
    memberId: string;
  }) {
    const result = await this.channelMemberService.addMember(
      data.channelId,
      data.userId,
      data.memberId,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelMemberService', 'RemoveMember')
  async removeMember(data: {
    channelId: string;
    userId: string;
    memberId: string;
  }) {
    const result = await this.channelMemberService.removeMember(
      data.channelId,
      data.userId,
      data.memberId,
    );
    return { message: result.message };
  }

  @GrpcMethod('ChannelMemberService', 'SearchMember')
  async searchMember(data: {
    channelId: string;
    userId: string;
    query: string;
  }) {
    const members = await this.channelMemberService.searchMember(
      data.channelId,
      data.userId,
      data.query,
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
