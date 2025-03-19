import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { Response } from 'express';
import { ChannelDto } from './channel.dto';

@Controller('channels/:username')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post(':serverId')
  async createChannel(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Body() body: ChannelDto,
    @Res() res: Response,
  ) {
    try {
      const channel = await this.channelService.createChannel(
        serverId,
        username,
        body,
      );
      return res.status(HttpStatus.CREATED).json(channel);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':serverId')
  async getChannels(@Param('serverId') serverId: string, @Res() res: Response) {
    try {
      const channels = await this.channelService.getChannels(serverId);
      return res.status(HttpStatus.OK).json(channels);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Put(':channelId')
  async updateChannel(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @Body() body: Partial<ChannelDto>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.channelService.updateChannel(
        channelId,
        username,
        body,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':channelId')
  async deleteChannel(
    @Param('channelId') channelId: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.channelService.deleteChannel(
        channelId,
        username,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
