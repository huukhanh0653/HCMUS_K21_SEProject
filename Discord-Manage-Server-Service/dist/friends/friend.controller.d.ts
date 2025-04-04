import { FriendService } from './friend.service';
import { Response } from 'express';
export declare class FriendController {
    private readonly friendService;
    constructor(friendService: FriendService);
    addFriend(username: string, friendUsername: string, res: Response): Promise<Response<any, Record<string, any>>>;
    removeFriend(username: string, friendUsername: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getFriends(username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    searchFriend(username: string, query: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
