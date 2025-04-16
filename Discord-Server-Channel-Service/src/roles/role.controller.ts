import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RoleService } from './role.service';
import { RoleDto } from './role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('roles')
@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // gRPC Methods
  @GrpcMethod('RoleService', 'CreateRole')
  async createRole(data: { serverId: string } & Partial<RoleDto>) {
    const result = await this.roleService.createRole(data.serverId, data);
    return { message: result.message };
  }

  @GrpcMethod('RoleService', 'GetRoleById')
  async getRoleById(data: { roleId: string }) {
    const role = await this.roleService.getRoleById(data.roleId);
    return this.mapRoleToResponse(role);
  }

  @GrpcMethod('RoleService', 'GetRoleByName')
  async getRoleByName(data: { serverId: string; name: string }) {
    const role = await this.roleService.getRoleByName(data.serverId, data.name);
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

  // RESTful Methods
  @Post(':serverId')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 200, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async createRoleRest(
    @Param('serverId') serverId: string,
    @Body() data: RoleDto,
  ) {
    return this.roleService.createRole(serverId, data);
  }

  @Get(':roleId')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Role details' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({
    name: 'roleId',
    description: 'ID of the role',
  })
  async getRoleByIdRest(@Param('roleId') roleId: string) {
    return this.roleService.getRoleById(roleId);
  }

  @Get(':serverId/:name')
  @ApiOperation({ summary: 'Get a role by name and server ID' })
  @ApiResponse({ status: 200, description: 'Role details' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  @ApiParam({
    name: 'name',
    description: 'The name of the role',
  })
  async getRoleByNameRest(
    @Param('serverId') serverId: string,
    @Param('name') name: string,
  ) {
    return this.roleService.getRoleByName(serverId, name);
  }

  @Get('by-server/:serverId')
  @ApiOperation({ summary: 'Get all roles in a server' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  @ApiParam({
    name: 'serverId',
    description: 'ID of the server',
  })
  async getRolesByServerRest(@Param('serverId') serverId: string) {
    return this.roleService.getRolesByServer(serverId);
  }

  @Put(':roleId')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({
    name: 'roleId',
    description: 'ID of the role',
  })
  async updateRoleRest(@Param('roleId') roleId: string, @Body() data: RoleDto) {
    return this.roleService.updateRole(roleId, data);
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiParam({
    name: 'roleId',
    description: 'ID of the role',
  })
  async deleteRoleRest(@Param('roleId') roleId: string) {
    return this.roleService.deleteRole(roleId);
  }
}
