import { Repository } from 'typeorm';
import { Friend } from './friend.entity';
import { UserService } from '../users/user.service';
export declare class FriendService {
    private friendRepository;
    private userService;
    constructor(friendRepository: Repository<Friend>, userService: UserService);
    private readonly esClient;
    addFriend(username: string, friendUsername: string): Promise<{
        message: string;
    }>;
    removeFriend(username: string, friendUsername: string): Promise<{
        message: string;
    }>;
    getFriends(username: string): Promise<{
        friend_username: any;
        friend_status: any;
        friend_profile_pic: any;
        added_at: any;
    }[]>;
    searchFriend(username: string, query: string): Promise<{
        friend_username: any;
        friend_status: any;
        friend_profile_pic: any;
        added_at: any;
    }[]>;
}
