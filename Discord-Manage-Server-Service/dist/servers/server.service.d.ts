import { Repository } from 'typeorm';
import { Server } from './server.entity';
import { UserService } from '../users/user.service';
import { ServerDto } from './server.dto';
export declare class ServerService {
    private serverRepository;
    private userService;
    constructor(serverRepository: Repository<Server>, userService: UserService);
    private readonly esClient;
    createServer(data: ServerDto, username: string): Promise<Server>;
    getServerById(id: string): Promise<Server>;
    getServers(username: string, query: string): Promise<any[]>;
    getAllServers(username: string): Promise<any[]>;
    updateServer(serverId: string, data: Partial<ServerDto>, username: string): Promise<{
        message: string;
    }>;
    deleteServer(serverId: string, username: string): Promise<{
        message: string;
    }>;
}
