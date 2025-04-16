import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { Server } from '../servers/server.entity';
import { RoleDto } from './role.dto';
export declare class RoleService {
    private roleRepository;
    private serverRepository;
    constructor(roleRepository: Repository<Role>, serverRepository: Repository<Server>);
    private readonly esClient;
    createRole(serverId: string, data: RoleDto): Promise<Role>;
    updateRole(roleId: string, data: Partial<RoleDto>): Promise<{
        message: string;
    }>;
    getRole(roleId: string): Promise<Role>;
    getRolesByServer(serverId: string): Promise<any[]>;
    deleteRole(roleId: string): Promise<{
        message: string;
    }>;
    createRoleGrpc(data: any): Promise<{
        id: any;
        server_id: any;
        name: any;
        color: any;
        position: any;
        is_default: any;
    }>;
    updateRoleGrpc(data: any): Promise<{
        message: string;
    }>;
    getRoleGrpc(data: {
        role_id: string;
    }): Promise<{
        id: any;
        server_id: any;
        name: any;
        color: any;
        position: any;
        is_default: any;
    }>;
    getRolesByServerGrpc(data: {
        server_id: string;
    }): Promise<{
        roles: {
            id: any;
            server_id: any;
            name: any;
            color: any;
            position: any;
            is_default: any;
        }[];
    }>;
    deleteRoleGrpc(data: {
        role_id: string;
    }): Promise<{
        message: string;
    }>;
    private mapRoleToResponse;
}
