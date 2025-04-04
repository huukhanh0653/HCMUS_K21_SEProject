import { Server } from '../servers/server.entity';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';
export declare class ServerMember {
    id: string;
    server_id: string;
    user_id: string;
    role_id: string;
    joined_at: Date;
    updated_at: Date;
    server: Server;
    user: User;
    role: Role;
}
