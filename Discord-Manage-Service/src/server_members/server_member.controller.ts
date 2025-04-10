import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerMemberService } from './server_member.service';
import { ServerMemberDto } from './server_member.dto';

@Controller()
export class ServerMemberController {
  constructor(private readonly serverMemberService: ServerMemberService) {}

  @GrpcMethod('ServerMemberService', 'AddMember')
  async addMember(
    data: { serverId: string; username: string } & ServerMemberDto,
  ) {
    const result = await this.serverMemberService.addMember(
      data.serverId,
      data.username,
      { memberUsername: data.memberUsername, roleId: data.roleId },
    );
    return { message: result.message };
  }

  @GrpcMethod('ServerMemberService', 'RemoveMember')
  async removeMember(data: { serverId: string; username: string }) {
    const result = await this.serverMemberService.removeMember(
      data.serverId,
      data.username,
      data.username,
    );
    return { message: result.message };
  }

  @GrpcMethod('ServerMemberService', 'UpdateMemberRole')
  async updateMemberRole(
    data: { serverId: string; username: string } & ServerMemberDto,
  ) {
    const result = await this.serverMemberService.updateMemberRole(
      data.serverId,
      data.username,
      { memberUsername: data.memberUsername, roleId: data.roleId },
    );
    return { message: result.message };
  }

  @GrpcMethod('ServerMemberService', 'GetMembers')
  async getMembers(data: { serverId: string; username: string }) {
    const members = await this.serverMemberService.getMembers(
      data.serverId,
      data.username,
    );
    return {
      members: members.map((member: any) => this.mapMemberToInfo(member)),
    };
  }

  @GrpcMethod('ServerMemberService', 'SearchMember')
  async searchMember(data: {
    serverId: string;
    username: string;
    query: string;
  }) {
    const members = await this.serverMemberService.searchMember(
      data.serverId,
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
      roleName: member.role_name || '',
      profilePic: member.profile_pic || '',
      joinedAt: member.joined_at,
    };
  }
}
