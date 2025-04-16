import { User } from '../users/user.entity';
export declare class Friend {
    id: string;
    user_id: string;
    friend_id: string;
    added_at: Date;
    user: User;
    friend: User;
}
