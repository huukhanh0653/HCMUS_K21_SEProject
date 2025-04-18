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

  async addMember(channelId: string, memberId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return { message: 'Channel not found' };

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
      message: `Member added to channel \"${channel.name}\"`,
      member: memberToAdd,
    };
  }

  async removeMember(channelId: string, memberId: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return { message: 'Channel not found' };

    const member = await this.channelMemberRepository.findOne({
      where: { channel_id: channelId, user_id: memberId },
    });
    if (!member) return { message: 'User is not a member of this channel' };

    await this.channelMemberRepository.delete({ user_id: memberId });

    const memberToRemove = await this.userService.getUser(memberId);
    return {
      message: `\"${memberToRemove.username}\" removed from channel \"${channel.name}\"`,
    };
  }

  async searchMember(channelId: string, query: string) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) return { message: 'Channel not found', members: [] };

    const members = await this.channelMemberRepository.find({
      where: { channel_id: channelId },
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
          id: member.id,
          username: user.username,
          avatar: user.avatar,
          createdAt: member.created_at,
        };
      });

    return { message: 'Get members successfully', members: filteredMembers };
  }
}
