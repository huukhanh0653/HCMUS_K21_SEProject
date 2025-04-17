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
import { ServerService } from './server.service';
import { ServerDto } from './server.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('servers')
@ApiBearerAuth()
@Controller('servers/:userId')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  // gRPC Methods
  @GrpcMethod('ServerService', 'CreateServer')
  async createServer(data: { userId: string } & ServerDto) {
    const message = await this.serverService.createServer(data.userId, data);
    return { message };
  }

  @GrpcMethod('ServerService', 'GetAllServers')
  async getAllServers(data: { userId: string; query: string }) {
    const { message, servers } = await this.serverService.getAllServers(
      data.userId,
      data.query,
    );
    return {
      message,
      servers: servers.map((server: any) => this.mapServerToResponse(server)),
    };
  }

  @GrpcMethod('ServerService', 'GetServers')
  async getServers(data: { userId: string; query: string }) {
    const { message, servers } = await this.serverService.getServers(
      data.userId,
      data.query,
    );
    return {
      message,
      servers: servers.map((server: any) => this.mapServerToResponse(server)),
    };
  }

  @GrpcMethod('ServerService', 'UpdateServer')
  async updateServer(data: { serverId: string; userId: string } & ServerDto) {
    const message = await this.serverService.updateServer(
      data.serverId,
      data.userId,
      data,
    );
    return { message };
  }

  @GrpcMethod('ServerService', 'DeleteServer')
  async deleteServer(data: { serverId: string; userId: string }) {
    const message = await this.serverService.deleteServer(
      data.serverId,
      data.userId,
    );
    return { message };
  }

  private mapServerToResponse(server: any) {
    return {
      name: server.name,
      ownerUsername: server.owner_username,
      createdAt: server.created_at,
      serverPic: server.server_pic,
    };
  }

  // RESTful Methods
  @Post()
  @ApiOperation({ summary: 'Create a new server' })
  @ApiResponse({ status: 201, description: 'Server created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  async createServerRest(
    @Param('userId') userId: string,
    @Body() data: ServerDto,
  ) {
    return this.serverService.createServer(userId, data);
  }

  @Get('all')
  @ApiOperation({ summary: 'Search servers' })
  @ApiResponse({ status: 200, description: 'List of servers' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiQuery({
    name: 'query',
    description: 'Query string to filter servers by name',
    required: false,
  })
  async getAllServersRest(
    @Param('userId') userId: string,
    @Query('query') query: string = '',
  ) {
    return this.serverService.getAllServers(userId, query);
  }

  @Get()
  @ApiOperation({ summary: 'Search servers of the user' })
  @ApiResponse({ status: 200, description: 'List of servers of the user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiQuery({
    name: 'query',
    description: 'Query string to filter servers by name',
    required: false,
  })
  async getServersRest(
    @Param('userId') userId: string,
    @Query('query') query: string = '',
  ) {
    return this.serverService.getServers(userId, query);
  }

  @Put(':serverId')
  @ApiOperation({ summary: 'Update a server' })
  @ApiResponse({ status: 200, description: 'Server updated successfully' })
  @ApiResponse({ status: 404, description: 'Server not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async updateServerRest(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
    @Body() data: ServerDto,
  ) {
    return this.serverService.updateServer(serverId, userId, data);
  }

  @Delete(':serverId')
  @ApiOperation({ summary: 'Delete a server' })
  @ApiResponse({ status: 200, description: 'Server deleted successfully' })
  @ApiResponse({ status: 404, description: 'Server not found' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async deleteServerRest(
    @Param('userId') userId: string,
    @Param('serverId') serverId: string,
  ) {
    return this.serverService.deleteServer(serverId, userId);
  }
}
