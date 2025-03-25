import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { UserService } from '../users/user.service';
import { ServerDto } from './server.dto';
import { Client } from '@elastic/elasticsearch';

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
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = this.serverRepository.create({
      name: data.name,
      owner_id: user.id,
      created_at: new Date(),
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

  async getServerById(id: string) {
    const server = await this.serverRepository.findOne({ where: { id } });
    if (!server) throw new Error('Server not found');
    return server;
  }

  async getServers(username: string, query: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.esClient.search({
      index: 'servers',
      body: {
        query: {
          bool: {
            filter: [{ term: { owner_username: username } }],
            must: [
              {
                query_string: {
                  query: `*${query}*`,
                  fields: ['name'],
                },
              },
            ],
          },
        },
      },
    });

    const servers = result.hits.hits.map((hit: any) => hit._source);
    if (servers.length === 0) {
      throw new Error('No servers found');
    }

    return servers;
  }

  async getAllServers(username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    const result = await this.esClient.search({
      index: 'servers',
      body: {
        query: {
          term: { owner_username: username },
        },
      },
    });

    return result.hits.hits.map((hit: any) => hit._source);
  }

  async updateServer(
    serverId: string,
    data: Partial<ServerDto>,
    username: string,
  ) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can update the server');

    const updatedData: Partial<Server> = {
      name: data.name || server.name,
      server_pic:
        data.server_pic !== undefined ? data.server_pic : server.server_pic,
    };

    await this.serverRepository.update(serverId, updatedData);

    await this.esClient.update({
      index: 'servers',
      id: serverId,
      body: {
        doc: {
          name: updatedData.name,
          server_pic: updatedData.server_pic,
        },
      },
    });

    return { message: 'Server updated successfully' };
  }

  async deleteServer(serverId: string, username: string) {
    const user = await this.userService.getUserByUsername(username);
    if (!user) throw new Error('User not found');

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    if (server.owner_id !== user.id)
      throw new Error('Only the owner can delete the server');

    await this.serverRepository.delete(serverId);

    await this.esClient.delete({
      index: 'servers',
      id: serverId,
    });

    return { message: 'Server deleted successfully' };
  }
}
