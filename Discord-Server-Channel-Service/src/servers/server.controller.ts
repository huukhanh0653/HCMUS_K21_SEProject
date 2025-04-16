import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerService } from './server.service';
import { ServerDto } from './server.dto';

@Controller()
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @GrpcMethod('ServerService', 'CreateServer')
  async createServer(data: { userId: string } & ServerDto) {
    const result = await this.serverService.createServer(data.userId, data);
    return { message: result.message };
  }

  @GrpcMethod('ServerService', 'GetServers')
  async getServers(data: { userId: string; query: string }) {
    const servers = await this.serverService.getServers(
      data.userId,
      data.query,
    );
    return {
      servers: servers.map((server: any) => this.mapServerToResponse(server)),
    };
  }

  @GrpcMethod('ServerService', 'UpdateServer')
  async updateServer(
    data: { serverId: string; userId: string } & Partial<ServerDto>,
  ) {
    const result = await this.serverService.updateServer(
      data.serverId,
      data.userId,
      data,
    );
    return { message: result.message };
  }

  @GrpcMethod('ServerService', 'DeleteServer')
  async deleteServer(data: { serverId: string; userId: string }) {
    console.log(data);

    const result = await this.serverService.deleteServer(
      data.serverId,
      data.userId,
    );
    return { message: result.message };
  }

  private mapServerToResponse(server: any) {
    return {
      name: server.name,
      ownerUsername: server.owner_username,
      createdAt: server.created_at,
      serverPic: server.server_pic,
    };
  }
}
