import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Query,
  Param,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerMemberService } from './server_member.service';
import { ServerMemberDto } from './server_member.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('server-members')
@ApiBearerAuth()
@Controller('server-members/:serverId')
export class ServerMemberController {
  constructor(private readonly serverMemberService: ServerMemberService) {}

  // gRPC Methods
  @GrpcMethod('ServerMemberService', 'AddMember')
  async addMember(
    data: { serverId: string; userId: string } & ServerMemberDto,
  ) {
    const response = await this.serverMemberService.addMember(
      data.serverId,
      data.userId,
      { memberId: data.memberId, role: data.role },
    );
    return { ...response };
  }

  @GrpcMethod('ServerMemberService', 'JoinServer')
  async joinServer(data: { serverId: string } & ServerMemberDto) {
    const response = await this.serverMemberService.joinServer(data.serverId, {
      memberId: data.memberId,
      role: data.role,
    });
    return { ...response };
  }

  @GrpcMethod('ServerMemberService', 'RemoveMember')
  async removeMember(data: {
    serverId: string;
    userId: string;
    memberId: string;
  }) {
    const message = await this.serverMemberService.removeMember(
      data.serverId,
      data.userId,
      data.memberId,
    );
    return { message };
  }

  @GrpcMethod('ServerMemberService', 'UpdateMemberRole')
  async updateMemberRole(
    data: { serverId: string; userId: string } & ServerMemberDto,
  ) {
    const response = await this.serverMemberService.updateMemberRole(
      data.serverId,
      data.userId,
      { memberId: data.memberId, role: data.role },
    );
    return { ...response };
  }

  @GrpcMethod('ServerMemberService', 'SearchMember')
  async searchMember(data: { serverId: string; query: string }) {
    const { message, members } = await this.serverMemberService.searchMember(
      data.serverId,
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
  @Post(':userId')
  @ApiOperation({ summary: 'Add a member to a server' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async addMemberRest(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
    @Body() data: ServerMemberDto,
  ) {
    return this.serverMemberService.addMember(serverId, userId, data);
  }

  @Post()
  @ApiOperation({ summary: 'A member join in a server' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async joinServerRest(
    @Param('serverId') serverId: string,
    @Body() data: ServerMemberDto,
  ) {
    return this.serverMemberService.joinServer(serverId, data);
  }

  @Delete(':userId/:memberId')
  @ApiOperation({ summary: 'Remove a member from a server' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Member or server not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  @ApiParam({ name: 'memberId', description: 'ID of the member to delete' })
  async removeMemberRest(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.serverMemberService.removeMember(serverId, userId, memberId);
  }

  @Put(':userId')
  @ApiOperation({ summary: "Update a member's role in a server" })
  @ApiResponse({ status: 200, description: 'Member role updated successfully' })
  @ApiResponse({ status: 404, description: 'Member or role not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async updateMemberRoleRest(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
    @Body() data: ServerMemberDto,
  ) {
    return this.serverMemberService.updateMemberRole(serverId, userId, data);
  }

  @Get()
  @ApiOperation({ summary: 'Search members in a server' })
  @ApiResponse({ status: 200, description: 'List of members' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  @ApiQuery({
    name: 'query',
    description: 'Query string to filter members by name',
    required: false,
  })
  async searchMemberRest(
    @Param('serverId') serverId: string,
    @Query('query') query: string = '',
  ) {
    return this.serverMemberService.searchMember(serverId, query);
  }
}
