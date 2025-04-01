import {
  Controller,
  Post,
  Delete,
  Put,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ServerMemberService } from './server_member.service';
import { ServerMemberDto } from './server_member.dto';
import { Response } from 'express';

@Controller('servers/:serverId/members')
export class ServerMemberController {
  constructor(private readonly serverMemberService: ServerMemberService) {}

  @Post(':username')
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

  @Delete(':username')
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

  @Put(':username')
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

  @Get()
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

  @Get('search')
  async searchMember(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Query('query') query: string,
    @Res() res: Response,
  ) {
    if (!query || query.trim() === '') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Query parameter is required');
    }

    try {
      const members = await this.serverMemberService.searchMember(
        serverId,
        query,
        username,
      );
      return res.status(HttpStatus.OK).json(members);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }
}
