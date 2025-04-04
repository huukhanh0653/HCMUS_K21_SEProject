import { UserService } from './user.service';
import { Response } from 'express';
import { UserDto } from './user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(body: UserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    searchUsers(username: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllUsers(res: Response): Promise<Response<any, Record<string, any>>>;
    updateUser(username: string, body: Partial<UserDto>, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(username: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
