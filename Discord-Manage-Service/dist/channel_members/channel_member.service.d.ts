import { Repository } from 'typeorm';
import { ChannelMember } from './channel_member.entity';
import { Channel } from '../channels/channel.entity';
import { UserService } from '../users/user.service';
import { ChannelMemberDto } from './channel_member.dto';
export declare class ChannelMemberService {
    private channelMemberRepository;
    private channelRepository;
    private userService;
    constructor(channelMemberRepository: Repository<ChannelMember>, channelRepository: Repository<Channel>, userService: UserService);
    private readonly esClient;
    addMember(channelId: string, username: string, data: ChannelMemberDto): Promise<{
        message: string;
    }>;
    removeMember(channelId: string, username: string, memberUsername: string): Promise<{
        message: string;
    }>;
    getMembers(channelId: string, username: string): Promise<any[]>;
    searchMember(channelId: string, query: string, username: string): Promise<any[]>;
    addMemberGrpc(data: {
        channel_id: string;
        username: string;
        member_username: string;
    }): Promise<{
        message: string;
    }>;
    removeMemberGrpc(data: {
        channel_id: string;
        username: string;
        member_username: string;
    }): Promise<{
        message: string;
    }>;
    getMembersGrpc(data: {
        channel_id: string;
        username: string;
    }): Promise<{
        members: {
            username: any;
            profile_pic: any;
            created_at: any;
        }[];
    }>;
    searchMemberGrpc(data: {
        channel_id: string;
        username: string;
        query: string;
    }): Promise<{
        members: {
            username: any;
            profile_pic: any;
            created_at: any;
        }[];
    }>;
    private mapMemberToInfo;
}
