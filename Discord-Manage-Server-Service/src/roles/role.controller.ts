import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './role.dto';
import { Response } from 'express';

@Controller('servers/:serverId/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(
    @Param('serverId') serverId: string,
    @Body() body: RoleDto,
    @Res() res: Response,
  ) {
    try {
      const role = await this.roleService.createRole(serverId, body);
      return res.status(HttpStatus.CREATED).json(role);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':roleId')
  async getRole(
    @Param('serverId') serverId: string,
    @Param('roleId') roleId: string,
    @Res() res: Response,
  ) {
    try {
      const role = await this.roleService.getRole(roleId);
      return res.status(HttpStatus.OK).json(role);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }

  @Get()
  async getRolesByServer(
    @Param('serverId') serverId: string,
    @Res() res: Response,
  ) {
    try {
      const roles = await this.roleService.getRolesByServer(serverId);
      return res.status(HttpStatus.OK).json(roles);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Put(':roleId')
  async updateRole(
    @Param('serverId') serverId: string,
    @Param('roleId') roleId: string,
    @Body() body: Partial<RoleDto>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.roleService.updateRole(roleId, body);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':roleId')
  async deleteRole(
    @Param('serverId') serverId: string,
    @Param('roleId') roleId: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.roleService.deleteRole(roleId);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
