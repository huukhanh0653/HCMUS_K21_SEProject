import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { UserService } from 'src/users/user.service';
import { RoleService } from '../roles/role.service';
import { ServerMemberDto } from './server_member.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ChannelMember } from 'src/channel_members/channel_member.entity';

@Injectable()
export class ServerMemberService {
  constructor(
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async addMember(serverId: string, userId: string, data: ServerMemberDto) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can add members' };

    const role = await this.roleService.getRoleByName(serverId, data.role!);
    if (!role) return { message: 'Role not found' };

    const memberToAdd = await this.userService.getUser(data.memberId!);
    if (!memberToAdd) return { message: 'User to add not found' };

    const existingMember = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: data.memberId },
    });
    if (existingMember) return { message: 'User is already a member' };

    const member = this.serverMemberRepository.create({
      server_id: serverId,
      user_id: data.memberId,
      role_id: role.id,
    });

    await this.serverMemberRepository.save(member);

    return {
      message: `${memberToAdd.username} added to server ${server.name} with role ${role.name}`,
    };
  }

  async removeMember(serverId: string, userId: string, memberId: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };

    if (server.owner_id !== userId)
      return { message: 'Only the owner can remove members' };

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: memberId },
    });
    if (!member) return { message: 'User is not a member' };

    await this.channelMemberRepository.delete({ user_id: memberId });
    await this.serverMemberRepository.delete({ user_id: memberId });

    const memberToRemove = await this.userService.getUser(memberId);
    return {
      message: `${memberToRemove.username} removed from server ${server.name}`,
    };
  }

  async updateMemberRole(
    serverId: string,
    userId: string,
    data: ServerMemberDto,
  ) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto, {
      skipMissingProperties: true,
    });
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };
    if (server.owner_id !== userId)
      return { message: 'Only the owner can update member roles' };

    const role = await this.roleService.getRoleByName(serverId, data.role!);
    if (!role) return { message: 'Role not found' };

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: data.memberId },
    });
    if (!member) return { message: 'User is not a member' };

    await this.serverMemberRepository.update(member.id, {
      role_id: role.id,
    });

    const memberToUpdate = await this.userService.getUser(data.memberId);
    return {
      message: `Updated role of ${memberToUpdate.username} to ${role.name}`,
    };
  }

  async getMemberById(serverId: string, userId: string) {
    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: userId },
    });
    return member;
  }

  async searchMember(serverId: string, query: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found', members: [] };

    const members = await this.serverMemberRepository.find({
      where: { server_id: serverId },
    });
    const users = await this.userService.getUsers();

    const filteredMembers = members.filter((member) => {
      const user = users.find((u: any) => u.id === member.user_id);
      return user && user.username.toLowerCase().includes(query.toLowerCase());
    });

    return { message: 'Get members successfully', members: filteredMembers };
  }
}
