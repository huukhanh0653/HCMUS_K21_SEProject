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
    getFriends(username: string): Promise<any[]>;
    searchFriend(username: string, query: string): Promise<any[]>;
    addFriendGrpc(data: {
        username: string;
        friend_username: string;
    }): Promise<{
        message: string;
    }>;
    removeFriendGrpc(data: {
        username: string;
        friend_username: string;
    }): Promise<{
        message: string;
    }>;
    getFriendsGrpc(data: {
        username: string;
    }): Promise<{
        friends: {
            friend_username: any;
            friend_status: any;
            friend_profile_pic: any;
            added_at: any;
        }[];
    }>;
    searchFriendGrpc(data: {
        username: string;
        query: string;
    }): Promise<{
        friends: {
            friend_username: any;
            friend_status: any;
            friend_profile_pic: any;
            added_at: any;
        }[];
    }>;
    private mapFriendToInfo;
}
