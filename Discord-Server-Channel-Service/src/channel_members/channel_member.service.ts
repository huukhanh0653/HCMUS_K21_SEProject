import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';
import { UserService } from 'src/users/user.service';

@Injectable()
export class ChannelMemberService {
  constructor(
    @InjectRepository(ChannelMember)
    private channelMemberRepository: Repository<ChannelMember>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    private userService: UserService,
  ) {}

  async addMember(channelId: string, userId: string, memberId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['server'],
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== userId)
      return { message: 'Only the owner can add members' };

    const memberToAdd = await this.userService.getUser(memberId);
    if (!memberToAdd) return { message: 'User to add not found' };

    const existingMember = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberId },
    });
    if (existingMember)
      return { message: 'User is already a member of this channel' };

    const member = this.channelMemberRepository.create({
      channel_id: channelId,
      user_id: memberId,
    });

    await this.channelMemberRepository.save(member);

    return {
      message: `${memberToAdd.username} added to channel ${channel.name}`,
    };
  }

  async removeMember(channelId: string, userId: string, memberId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return { message: 'Channel not found' };
    if (channel.server.owner_id !== userId)
      return { message: 'Only the owner can remove members' };

    const member = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberId },
    });
    if (!member) return { message: 'User is not a member of this channel' };

    await this.channelMemberRepository.delete(memberId);

    const memberToRemove = await this.userService.getUser(memberId);
    return {
      message: `${memberToRemove.username} removed from channel ${channel.name}`,
    };
  }

  async searchMember(channelId: string, userId: string, query: string) {
    const user = await this.userService.getUser(userId);
    if (!user) return [];

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return [];

    const members = await this.channelMemberRepository.find({
      where: { channel_id: channelId },
    });
    if (!members) return [];

    const users = await this.userService.getUsers();

    const filteredMembers = members.filter((member) => {
      const user = users.find((u: any) => u.id === member.user_id);
      return user && user.username.toLowerCase().includes(query.toLowerCase());
    });

    return filteredMembers;
  }
}
