import { Server } from '../servers/server.entity';
export declare class Channel {
    id: string;
    server_id: string;
    name: string;
    type: string;
    created_at: Date;
    is_private: boolean;
    server: Server;
}
