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
    getRole(roleId: string): Promise<Role>;
    getRolesByServer(serverId: string): Promise<any[]>;
    updateRole(roleId: string, data: Partial<RoleDto>): Promise<{
        message: string;
    }>;
    deleteRole(roleId: string): Promise<{
        message: string;
    }>;
}
