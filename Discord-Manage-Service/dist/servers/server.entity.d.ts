import { User } from '../users/user.entity';
export declare class Server {
    id: string;
    name: string;
    owner_id: string;
    created_at: Date;
    server_pic: string;
    owner: User;
}
