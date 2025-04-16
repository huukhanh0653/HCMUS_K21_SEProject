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
    updateServer(serverId: string, data: Partial<ServerDto>, username: string): Promise<{
        message: string;
    }>;
    getServers(username: string, query: string): Promise<any[]>;
    getAllServers(username: string): Promise<any[]>;
    deleteServer(serverId: string, username: string): Promise<{
        message: string;
    }>;
    createServerGrpc(data: any): Promise<{
        id: any;
        name: any;
        owner_id: any;
        created_at: any;
        server_pic: any;
    }>;
    updateServerGrpc(data: any): Promise<{
        message: string;
    }>;
    getServersGrpc(data: {
        username: string;
        query: string;
    }): Promise<{
        servers: {
            id: any;
            name: any;
            owner_id: any;
            created_at: any;
            server_pic: any;
        }[];
    }>;
    getAllServersGrpc(data: {
        username: string;
    }): Promise<{
        servers: {
            id: any;
            name: any;
            owner_id: any;
            created_at: any;
            server_pic: any;
        }[];
    }>;
    deleteServerGrpc(data: {
        server_id: string;
        username: string;
    }): Promise<{
        message: string;
    }>;
    private mapServerToResponse;
}
