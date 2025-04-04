import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { ChannelMember } from '../channel_members/channel_member.entity';
import { UserService } from '../users/user.service';
import { ChannelMemberService } from '../channel_members/channel_member.service';
import { ChannelDto } from './channel.dto';
export declare class ChannelService {
    private channelRepository;
    private serverRepository;
    private channelMemberRepository;
    private userService;
    private channelMemberService;
    constructor(channelRepository: Repository<Channel>, serverRepository: Repository<Server>, channelMemberRepository: Repository<ChannelMember>, userService: UserService, channelMemberService: ChannelMemberService);
    private readonly esClient;
    createChannel(serverId: string, data: ChannelDto, username: string): Promise<Channel>;
    getChannels(username: string, serverId: string, query: string): Promise<any[]>;
    getChannelsByServer(serverId: string, username: string): Promise<any[]>;
    updateChannel(channelId: string, data: Partial<ChannelDto>, username: string): Promise<{
        message: string;
    }>;
    deleteChannel(channelId: string, username: string): Promise<{
        message: string;
    }>;
}
