import {
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ServerMemberService } from './server_member.service';
import { Response } from 'express';
import { ServerMemberDto } from './server_member.dto';

@Controller('server-members/:username')
export class ServerMemberController {
  constructor(private readonly serverMemberService: ServerMemberService) {}

  @Post(':serverId')
  async addMember(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Body() body: ServerMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.serverMemberService.addMember(
        serverId,
        username,
        body,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':serverId')
  async removeMember(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.serverMemberService.removeMember(
        serverId,
        username,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Put(':serverId')
  async updateMemberRole(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Body() body: ServerMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.serverMemberService.updateMemberRole(
        serverId,
        username,
        body,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':serverId')
  async getMembers(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const members = await this.serverMemberService.getMembers(
        serverId,
        username,
      );
      return res.status(HttpStatus.OK).json(members);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
