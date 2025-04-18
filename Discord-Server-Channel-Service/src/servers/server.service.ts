import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Server } from './server.entity';
import { ServerDto } from './server.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ServerMemberService } from '../server_members/server_member.service';
import { RoleService } from 'src/roles/role.service';
import { UserService } from 'src/users/user.service';
import { ServerMember } from 'src/server_members/server_member.entity';
import { Role } from 'src/roles/role.entity';

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    private userService: UserService,
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    private serverMemberService: ServerMemberService,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private roleService: RoleService,
  ) {}

  async createServer(userId: string, data: ServerDto) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto);
    if (errors.length > 0)
      return { message: `Validation failed: ${errors}`, server: {} };

    const user = await this.userService.getUser(userId);
    if (!user) return { message: 'User not found', server: {} };

    const server = this.serverRepository.create({
      name: data.name,
      owner_id: userId,
      server_pic: data.serverPic,
    });

    await this.serverRepository.save(server);
    await this.roleService.createRole(server.id, { name: 'Owner' });
    await this.roleService.createRole(server.id, { name: 'Member' });
    await this.serverMemberService.addMember(server.id, userId, {
      memberId: userId,
      role: 'Owner',
    });

    return { message: 'Server created successfully', server };
  }

  async updateServer(serverId: string, userId: string, data: ServerDto) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto, { skipMissingProperties: true });
    if (errors.length > 0)
      return { message: `Validation failed: ${errors}`, server: {} };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can update the server', server: {} };

    const updatedData = {
      name: data.name || server.name,
      server_pic:
        data.serverPic !== undefined ? data.serverPic : server.server_pic,
    };

    await this.serverRepository.update(serverId, updatedData);

    return { message: 'Server updated successfully', server: updatedData };
  }

  async getAllServers(userId: string, query: string) {
    const user = await this.userService.getUser(userId);
    if (!user) return { message: 'User not found', servers: [] };
    if (!user.is_admin)
      return {
        message: 'User does not have sufficient access rights',
        servers: [],
      };

    const servers = await this.serverRepository.find({
      where: { name: Like(`%${query}%`) },
    });

    const users = await this.userService.getUsers();
    const serversWithOwner = servers.map((server) => {
      const owner = users.find((u: any) => u.id === server.owner_id);
      return {
        ...server,
        owner_username: owner.username,
      };
    });

    return { message: 'Get servers successfully', servers: serversWithOwner };
  }

  async getServers(userId: string, query: string) {
    const user = await this.userService.getUser(userId);
    if (!user) return { message: 'User not found', servers: [] };

    const serverMembers = await this.serverMemberRepository.find({
      where: { user_id: userId },
      relations: ['server'],
    });

    const servers = serverMembers
      .map((member) => member.server)
      .filter((server) =>
        server.name.toLowerCase().includes(query.toLowerCase()),
      );

    const users = await this.userService.getUsers();
    const serversWithOwner = servers.map((server) => {
      const owner = users.find((u: any) => u.id === server.owner_id);
      return {
        ...server,
        owner_username: owner.username,
      };
    });

    return { message: 'Get servers successfully', servers: serversWithOwner };
  }

  async getServerById(serverId: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });

    if (!server) return { message: 'Server not found', server: null };

    const owner = await this.userService.getUser(server.owner_id);
    const serverWithOwner = {
      ...server,
      owner_username: owner.username,
    };

    return { message: 'Get server successfully', server: serverWithOwner };
  }

  async deleteServer(serverId: string, userId: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can delete the server' };

    await this.serverMemberRepository.delete({ server_id: serverId });
    await this.roleRepository.delete({ server_id: serverId });
    await this.serverRepository.delete({ id: serverId });

    return { message: 'Server deleted successfully' };
  }
}
