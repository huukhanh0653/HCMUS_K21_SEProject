import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { UserService } from '../users/user.service';
import { Client } from '@elastic/elasticsearch';
import { GrpcMethod } from '@nestjs/microservices';
import { ServerDto } from './server.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    private userService: UserService,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  async createServer(data: ServerDto, username: string) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto);
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) =>
            e.constraints
              ? Object.values(e.constraints).join(', ')
              : 'Unknown error',
          )
          .join('; ')}`,
      );
    }

    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = this.serverRepository.create({
      name: data.name,
      owner_id: user.id,
      server_pic: data.server_pic,
    });

    await this.serverRepository.save(server);

    await this.esClient.index({
      index: 'servers',
      id: server.id,
      body: {
        name: server.name,
        owner_username: user.username,
        created_at: server.created_at,
        server_pic: server.server_pic,
      },
    });

    return server;
  }

  async updateServer(
    serverId: string,
    data: Partial<ServerDto>,
    username: string,
  ) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto, { skipMissingProperties: true });
    if (errors.length > 0) {
      throw new Error(
        `Validation failed: ${errors
          .map((e) =>
            e.constraints
              ? Object.values(e.constraints).join(', ')
              : 'Unknown error',
          )
          .join('; ')}`,
      );
    }

    const user = await this.userService.getUserByUsername(username);
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');
    if (server.owner_id !== user.id)
      throw new Error('Only the owner can update the server');

    const updatedData = {
      name: data.name || server.name,
      server_pic:
        data.server_pic !== undefined ? data.server_pic : server.server_pic,
    };

    await this.serverRepository.update(serverId, updatedData);

    await this.esClient.update({
      index: 'servers',
      id: serverId,
      body: { doc: updatedData },
    });

    return { message: 'Server updated successfully' };
  }

  async getServers(username: string, query: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const result = await this.esClient.search({
      index: 'servers',
      body: {
        query: {
          bool: {
            filter: [{ term: { owner_username: username } }],
            must: [{ query_string: { query: `*${query}*`, fields: ['name'] } }],
          },
        },
      },
    });

    const servers = result.hits.hits.map((hit: any) => hit._source);
    if (servers.length === 0) throw new Error('No servers found');
    return servers;
  }

  async getAllServers(username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const result = await this.esClient.search({
      index: 'servers',
      body: { query: { term: { owner_username: username } } },
    });
    return result.hits.hits.map((hit: any) => hit._source);
  }

  async deleteServer(serverId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');
    if (server.owner_id !== user.id)
      throw new Error('Only the owner can delete the server');

    await this.serverRepository.delete(serverId);
    await this.esClient.delete({ index: 'servers', id: serverId });
    return { message: 'Server deleted successfully' };
  }

  @GrpcMethod('ServerService', 'CreateServer')
  async createServerGrpc(data: any) {
    const server = await this.createServer(data, data.username);
    return this.mapServerToResponse(server);
  }

  @GrpcMethod('ServerService', 'UpdateServer')
  async updateServerGrpc(data: any) {
    const result = await this.updateServer(data.server_id, data, data.username);
    return { message: result.message };
  }

  @GrpcMethod('ServerService', 'GetServers')
  async getServersGrpc(data: { username: string; query: string }) {
    const servers = await this.getServers(data.username, data.query);
    return {
      servers: servers.map((server: any) => this.mapServerToResponse(server)),
    };
  }

  @GrpcMethod('ServerService', 'GetAllServers')
  async getAllServersGrpc(data: { username: string }) {
    const servers = await this.getAllServers(data.username);
    return {
      servers: servers.map((server: any) => this.mapServerToResponse(server)),
    };
  }

  @GrpcMethod('ServerService', 'DeleteServer')
  async deleteServerGrpc(data: { server_id: string; username: string }) {
    const result = await this.deleteServer(data.server_id, data.username);
    return { message: result.message };
  }

  private mapServerToResponse(server: any) {
    return {
      id: server.id,
      name: server.name,
      owner_id: server.owner_id,
      created_at: server.created_at.toISOString(),
      server_pic: server.server_pic || '',
    };
  }
}
