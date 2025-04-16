import { Repository } from 'typeorm';
import { ServerMember } from './server_member.entity';
import { Server } from '../servers/server.entity';
import { UserService } from '../users/user.service';
import { RoleService } from '../roles/role.service';
import { ServerMemberDto } from './server_member.dto';
export declare class ServerMemberService {
    private serverMemberRepository;
    private serverRepository;
    private userService;
    private roleService;
    constructor(serverMemberRepository: Repository<ServerMember>, serverRepository: Repository<Server>, userService: UserService, roleService: RoleService);
    private readonly esClient;
    addMember(serverId: string, username: string, data: ServerMemberDto): Promise<{
        message: string;
    }>;
    removeMember(serverId: string, username: string, memberUsername: string): Promise<{
        message: string;
    }>;
    updateMemberRole(serverId: string, username: string, data: ServerMemberDto): Promise<{
        message: string;
    }>;
    getMembers(serverId: string, username: string): Promise<any[]>;
    searchMember(serverId: string, query: string, username: string): Promise<any[]>;
    addMemberGrpc(data: any): Promise<{
        message: string;
    }>;
    updateMemberRoleGrpc(data: any): Promise<{
        message: string;
    }>;
    removeMemberGrpc(data: {
        server_id: string;
        username: string;
        member_username: string;
    }): Promise<{
        message: string;
    }>;
    getMembersGrpc(data: {
        server_id: string;
        username: string;
    }): Promise<{
        members: {
            username: any;
            role_name: any;
            profile_pic: any;
            joined_at: any;
        }[];
    }>;
    searchMemberGrpc(data: {
        server_id: string;
        username: string;
        query: string;
    }): Promise<{
        members: {
            username: any;
            role_name: any;
            profile_pic: any;
            joined_at: any;
        }[];
    }>;
    private mapMemberToInfo;
}
