import { ServerService } from './server.service';
import { ServerDto } from './server.dto';
import { Response } from 'express';
export declare class ServerController {
    private readonly serverService;
    constructor(serverService: ServerService);
    createServer(username: string, body: ServerDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getServer(serverName: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllServers(username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateServer(serverId: string, username: string, body: Partial<ServerDto>, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteServer(serverId: string, username: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
