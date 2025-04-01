import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ChannelMemberService } from './channel_member.service';
import { ChannelMemberDto } from './channel_member.dto';
import { Response } from 'express';

@Controller('channels/:channelId/members')
export class ChannelMemberController {
  constructor(private readonly channelMemberService: ChannelMemberService) {}

  @Post(':username')
  async addMember(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @Body() body: ChannelMemberDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.channelMemberService.addMember(
        channelId,
        username,
        body,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':username/:memberUsername')
  async removeMember(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @Param('memberUsername') memberUsername: string, // Đổi từ userId thành memberUsername
    @Res() res: Response,
  ) {
    try {
      const result = await this.channelMemberService.removeMember(
        channelId,
        username,
        memberUsername,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':username')
  async getMembers(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const members = await this.channelMemberService.getMembers(
        channelId,
        username,
      );
      return res.status(HttpStatus.OK).json(members);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('search/:username')
  async searchMember(
    @Param('channelId') channelId: string,
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
      const members = await this.channelMemberService.searchMember(
        channelId,
        query,
        username,
      );
      return res.status(HttpStatus.OK).json(members);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }
}
