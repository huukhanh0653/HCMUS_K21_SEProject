import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    private readonly esClient;
    createUser(data: UserDto): Promise<User>;
    updateUser(username: string, data: Partial<UserDto>): Promise<{
        message: string;
    }>;
    getUserByUsername(username: string): Promise<User>;
    searchUsers(query: string): Promise<any[]>;
    deleteUser(username: string): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<any[]>;
    createUserGrpc(data: any): Promise<{
        id: any;
        username: any;
        email: any;
        profile_pic: any;
        status: any;
        created_at: any;
        updated_at: any;
        is_admin: any;
    }>;
    updateUserGrpc(data: any): Promise<{
        message: string;
    }>;
    getUserByUsernameGrpc(data: {
        username: string;
    }): Promise<{
        id: any;
        username: any;
        email: any;
        profile_pic: any;
        status: any;
        created_at: any;
        updated_at: any;
        is_admin: any;
    }>;
    searchUsersGrpc(data: {
        query: string;
    }): Promise<{
        users: {
            id: any;
            username: any;
            email: any;
            profile_pic: any;
            status: any;
            created_at: any;
            updated_at: any;
            is_admin: any;
        }[];
    }>;
    deleteUserGrpc(data: {
        username: string;
    }): Promise<{
        message: string;
    }>;
    getAllUsersGrpc(data: any): Promise<{
        users: {
            id: any;
            username: any;
            email: any;
            profile_pic: any;
            status: any;
            created_at: any;
            updated_at: any;
            is_admin: any;
        }[];
    }>;
    private mapUserToResponse;
}
