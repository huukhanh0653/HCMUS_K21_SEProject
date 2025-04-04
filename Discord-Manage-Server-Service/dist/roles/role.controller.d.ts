import { RoleService } from './role.service';
import { RoleDto } from './role.dto';
import { Response } from 'express';
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    createRole(serverId: string, body: RoleDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getRole(serverId: string, roleId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getRolesByServer(serverId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateRole(serverId: string, roleId: string, body: Partial<RoleDto>, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteRole(serverId: string, roleId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
