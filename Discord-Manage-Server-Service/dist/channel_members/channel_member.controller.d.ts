import { ChannelMemberService } from './channel_member.service';
import { ChannelMemberDto } from './channel_member.dto';
import { Response } from 'express';
export declare class ChannelMemberController {
    private readonly channelMemberService;
    constructor(channelMemberService: ChannelMemberService);
    addMember(channelId: string, username: string, body: ChannelMemberDto, res: Response): Promise<Response<any, Record<string, any>>>;
    removeMember(channelId: string, username: string, memberUsername: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getMembers(channelId: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    searchMember(channelId: string, username: string, query: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
