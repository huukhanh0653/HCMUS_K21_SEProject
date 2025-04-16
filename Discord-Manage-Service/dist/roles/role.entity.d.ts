import { Server } from '../servers/server.entity';
export declare class Role {
    id: string;
    server_id: string;
    name: string;
    color: string;
    position: number;
    is_default: boolean;
    server: Server;
}
