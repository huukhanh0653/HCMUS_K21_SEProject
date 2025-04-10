import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { RoleDto } from './role.dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @GrpcMethod('RoleService', 'CreateRole')
  async createRole(data: { serverId: string } & RoleDto) {
    const result = await this.roleService.createRole(data.serverId, data);
    return { message: result.message };
  }

  @GrpcMethod('RoleService', 'GetRole')
  async getRole(data: { roleId: string }) {
    const role = await this.roleService.getRole(data.roleId);
    return this.mapRoleToResponse(role);
  }

  @GrpcMethod('RoleService', 'GetRolesByServer')
  async getRolesByServer(data: { serverId: string }) {
    const roles = await this.roleService.getRolesByServer(data.serverId);
    return { roles: roles.map((role: any) => this.mapRoleToResponse(role)) };
  }

  @GrpcMethod('RoleService', 'UpdateRole')
  async updateRole(data: { roleId: string } & Partial<RoleDto>) {
    const result = await this.roleService.updateRole(data.roleId, data);
    return { message: result.message };
  }

  @GrpcMethod('RoleService', 'DeleteRole')
  async deleteRole(data: { roleId: string }) {
    const result = await this.roleService.deleteRole(data.roleId);
    return { message: result.message };
  }

  private mapRoleToResponse(role: any) {
    return {
      id: role.id,
      serverId: role.server_id,
      name: role.name,
      color: role.color || '',
      position: role.position || 0,
      isDefault: role.is_default || false,
    };
  }
}
