import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { Client } from '@elastic/elasticsearch';
import { ServerDto } from './server.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
  ) {
    this.esClient = new Client({
      node: process.env.ELASTIC_NODE,
      auth: { apiKey: process.env.ELASTIC_API_KEY! },
    });
  }

  private readonly esClient: Client;

  private user = {
    id: '0000cf74-73b9-494f-90dd-81ca863bbc3c',
    username: 'user7660',
    email: 'user7660@example.dating',
    password_hash:
      '$2b$12$/fScO2Ie4/XNpbMZxa.BlO5p8c0c4v9lYw1HsdS1WNZKAENddcnxW',
    profile_pic: null,
    status: 'online',
    created_at: '2021-06-06 10:57:21',
    updated_at: '2021-06-06 10:57:21',
    is_admin: false,
  };

  async createServer(username: string, data: ServerDto) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = this.user;
    if (!user) return { message: 'User not found' };

    const server = this.serverRepository.create({
      name: data.name,
      owner_id: user.id,
      server_pic: data.serverPic,
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

    return { message: 'Server created successfully' };
  }

  async updateServer(
    server_id: string,
    username: string,
    data: Partial<ServerDto>,
  ) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto, { skipMissingProperties: true });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = this.user;
    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== user.id)
      return { message: 'Only the owner can update the server' };

    const updatedData = {
      name: data.name || server.name,
      server_pic:
        data.serverPic !== undefined ? data.serverPic : server.server_pic,
    };

    await this.serverRepository.update(server_id, updatedData);

    await this.esClient.update({
      index: 'servers',
      id: server_id,
      body: { doc: updatedData },
    });

    return { message: 'Server updated successfully' };
  }

  async getServers(username: string, query: string) {
    const user = this.user;
    if (!user) return [];

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
    return servers;
  }

  async getAllServers(username: string) {
    const user = this.user;
    if (!user) return [];

    const result = await this.esClient.search({
      index: 'servers',
      body: { query: { term: { owner_username: username } } },
    });

    const servers = result.hits.hits.map((hit: any) => hit._source);
    return servers;
  }

  async deleteServer(server_id: string, username: string) {
    const user = this.user;
    if (!user) return { message: 'User not found' };

    const server = await this.serverRepository.findOne({
      where: { id: server_id },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== user.id)
      return { message: 'Only the owner can delete the server' };

    await this.serverRepository.delete(server_id);
    await this.esClient.delete({ index: 'servers', id: server_id });
    return { message: 'Server deleted successfully' };
  }
}
