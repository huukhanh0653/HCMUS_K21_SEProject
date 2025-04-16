import { Repository } from 'typeorm';
import { Channel } from './channel.entity';
import { Server } from '../servers/server.entity';
import { UserService } from '../users/user.service';
import { ChannelMemberService } from '../channel_members/channel_member.service';
import { ChannelDto } from './channel.dto';
export declare class ChannelService {
    private channelRepository;
    private serverRepository;
    private userService;
    private channelMemberService;
    constructor(channelRepository: Repository<Channel>, serverRepository: Repository<Server>, userService: UserService, channelMemberService: ChannelMemberService);
    private readonly esClient;
    createChannel(serverId: string, data: ChannelDto, username: string): Promise<Channel>;
    updateChannel(channelId: string, data: Partial<ChannelDto>, username: string): Promise<{
        message: string;
    }>;
    getChannels(username: string, serverId: string, query: string): Promise<any[]>;
    getChannelsByServer(serverId: string, username: string): Promise<any[]>;
    deleteChannel(channelId: string, username: string): Promise<{
        message: string;
    }>;
    createChannelGrpc(data: any): Promise<{
        id: any;
        server_id: any;
        name: any;
        type: any;
        created_at: any;
        is_private: any;
    }>;
    updateChannelGrpc(data: any): Promise<{
        message: string;
    }>;
    getChannelsGrpc(data: {
        username: string;
        server_id: string;
        query: string;
    }): Promise<{
        channels: {
            id: any;
            server_id: any;
            name: any;
            type: any;
            created_at: any;
            is_private: any;
        }[];
    }>;
    getChannelsByServerGrpc(data: {
        server_id: string;
        username: string;
    }): Promise<{
        channels: {
            id: any;
            server_id: any;
            name: any;
            type: any;
            created_at: any;
            is_private: any;
        }[];
    }>;
    deleteChannelGrpc(data: {
        channel_id: string;
        username: string;
    }): Promise<{
        message: string;
    }>;
    private mapChannelToResponse;
}
