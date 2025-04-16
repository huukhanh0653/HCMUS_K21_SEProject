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

@Injectable()
export class ServerService {
  constructor(
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    private userService: UserService,
    private serverMemberService: ServerMemberService,
    private roleService: RoleService,
  ) {}

  async createServer(userId: string, data: ServerDto) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const user = await this.userService.getUser(userId);
    if (!user) return { message: 'User not found' };

    const server = this.serverRepository.create({
      name: data.name,
      owner_id: userId,
      server_pic: data.serverPic,
    });

    await this.serverRepository.save(server);

    const role = await this.roleService.getRoleByName(server.id, 'Owner');
    await this.serverMemberService.addMember(server.id, userId, {
      memberId: userId,
      roleId: role?.id,
    });

    return { message: 'Server created successfully' };
  }

  async updateServer(
    serverId: string,
    userId: string,
    data: Partial<ServerDto>,
  ) {
    const serverDto = plainToClass(ServerDto, data);
    const errors = await validate(serverDto, { skipMissingProperties: true });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can update the server' };

    const updatedData = {
      name: data.name || server.name,
      server_pic:
        data.serverPic !== undefined ? data.serverPic : server.server_pic,
    };

    await this.serverRepository.update(serverId, updatedData);

    return { message: 'Server updated successfully' };
  }

  async getServers(userId: string, query: string) {
    const user = await this.userService.getUser(userId);
    if (!user) return [];

    const servers = await this.serverRepository.find({
      where: { owner_id: userId, name: Like(`%${query}%`) },
    });

    return servers;
  }

  async deleteServer(serverId: string, userId: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can delete the server' };

    await this.serverRepository.delete(serverId);

    return { message: 'Server deleted successfully' };
  }
}
