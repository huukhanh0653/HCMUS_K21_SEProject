import { ChannelService } from './channel.service';
import { ChannelDto } from './channel.dto';
import { Response } from 'express';
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    createChannel(serverId: string, username: string, body: ChannelDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getChannels(serverId: string, channelName: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getChannelsByServer(serverId: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateChannel(channelId: string, username: string, body: Partial<ChannelDto>, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteChannel(channelId: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
