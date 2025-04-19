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
import { Ban } from 'src/bans/ban.entity';

@Injectable()
export class ServerMemberService {
  constructor(
    @InjectRepository(ServerMember)
    private serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Server)
    private serverRepository: Repository<Server>,
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(Ban)
    private banRepository: Repository<Ban>,
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

    const ban = await this.banRepository.findOne({
      where: { server_id: serverId, user_id: data.memberId },
    });
    if (ban) return { message: 'This user has been banned in server' };

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
      message: `Member added to server \"${server.name}\" with role \"${role.name}\"`,
      member: memberToAdd,
    };
  }

  async joinServer(serverId: string, data: ServerMemberDto) {
    const serverMemberDto = plainToClass(ServerMemberDto, data);
    const errors = await validate(serverMemberDto);
    if (errors.length > 0) return { message: `Validation failed: ${errors}` };

    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };

    const ban = await this.banRepository.findOne({
      where: { server_id: serverId, user_id: data.memberId },
    });
    if (ban) return { message: 'This member has been banned in server' };

    const role = await this.roleService.getRoleByName(serverId, data.role!);
    if (!role) return { message: 'Role not found' };

    const memberToAdd = await this.userService.getUser(data.memberId);
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
      message: `Member added to server \"${server.name}\" with role \"${role.name}\"`,
      member: memberToAdd,
    };
  }

  async outServer(serverId: string, memberId: string) {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) return { message: 'Server not found' };

    const member = await this.serverMemberRepository.findOne({
      where: { server_id: serverId, user_id: memberId },
    });
    if (!member) return { message: 'User is not a member' };

    await this.channelMemberRepository.delete({ user_id: memberId });
    await this.serverMemberRepository.delete({ user_id: memberId });

    const memberToRemove = await this.userService.getUser(memberId);
    return {
      message: `\"${memberToRemove.username}\" exited from server \"${server.name}\"`,
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
      message: `\"${memberToRemove.username}\" removed from server \"${server.name}\"`,
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
      member: memberToUpdate,
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
      relations: ['role'],
    });
    const users = await this.userService.getUsers();

    const filteredMembers = members
      .filter((member) => {
        const user = users.find((u: any) => u.id === member.user_id);
        return (
          user && user.username.toLowerCase().includes(query.toLowerCase())
        );
      })
      .map((member) => {
        const user = users.find((u: any) => u.id === member.user_id);
        return {
          id: user.id,
          username: user.username || '',
          avatar: user.avatar || '',
          role: member.role.name || '',
          joinedAt: member.joined_at,
        };
      });

    return { message: 'Get members successfully', members: filteredMembers };
  }
}
