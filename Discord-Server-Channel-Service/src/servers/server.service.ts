import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Server } from './server.entity';
import { ServerDto } from './server.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ServerMemberService } from '../server_members/server_member.service';
import { RoleService } from 'src/roles/role.service';
import { UserService } from 'src/users/user.service';
import { ServerMember } from 'src/server_members/server_member.entity';
import { Role } from 'src/roles/role.entity';
import { Channel } from 'src/channels/channel.entity';
import { ChannelService } from 'src/channels/channel.service';
import { ChannelMember } from 'src/channel_members/channel_member.entity';
import { Ban } from 'src/bans/ban.entity';

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
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private channelService: ChannelService,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(Ban)
    private banRepository: Repository<Ban>,
  ) {}

  async createServer(userId: string, data: ServerDto) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto);
    if (errors.length > 0) throw new Error(`Validation failed: ${errors}`);

    const user = await this.userService.getUser(userId);
    if (!user) throw new Error('User not found');

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
    if (errors.length > 0) throw new Error(`Validation failed: ${errors}`);

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) throw new Error('Server not found');

    const user = await this.userService.getUser(userId);
    if (server.owner_id !== userId && !user.is_admin)
      throw new Error('Only the owner or admin can update the server');

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
    if (!user) throw new Error('User not found');
    if (!user.is_admin)
      throw new Error('User does not have sufficient access rights');

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
    if (!user) throw new Error('User not found');

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

    if (!server) throw new Error('Server not found');

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
    if (!server) throw new Error('Server not found');

    const user = await this.userService.getUser(userId);
    if (server.owner_id !== userId && !user.is_admin)
      throw new Error('Only the owner or admin can delete the server');

    const { channels } = await this.channelService.getChannelsByServer(
      serverId,
      '',
    );

    await Promise.all([
      this.banRepository.delete({ server_id: serverId }),
      this.roleRepository.delete({ server_id: serverId }), // Xóa roles trước
      this.channelMemberRepository.delete({
        channel_id: In(channels.map((c) => c.id)),
      }),
      this.channelRepository.delete({ server_id: serverId }),
      this.serverMemberRepository.delete({ server_id: serverId }),
    ]);

    await this.serverRepository.delete({ id: serverId });

    return { message: 'Server deleted successfully' };
  }
}
