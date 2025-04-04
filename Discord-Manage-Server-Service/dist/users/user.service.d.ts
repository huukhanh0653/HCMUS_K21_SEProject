import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    private readonly esClient;
    createUser(data: UserDto): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    searchUsers(query: string): Promise<import("@elastic/elasticsearch/lib/api/types").SearchHit<unknown>[]>;
    updateUser(username: string, data: Partial<UserDto>): Promise<{
        message: string;
    }>;
    deleteUser(username: string): Promise<{
        message: string;
    }>;
    getAllUsers(): Promise<any[]>;
}
