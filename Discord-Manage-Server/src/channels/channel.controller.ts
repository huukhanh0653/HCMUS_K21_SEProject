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
import { ChannelService } from './channel.service';
import { ChannelDto } from './channel.dto';
import { Response } from 'express';

@Controller('servers/:serverId/channels/:username')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  async createChannel(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Body() body: ChannelDto,
    @Res() res: Response,
  ) {
    try {
      const channel = await this.channelService.createChannel(
        serverId,
        body,
        username,
      );
      return res.status(HttpStatus.CREATED).json(channel);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':channelName')
  async getChannels(
    @Param('serverId') serverId: string,
    @Param('channelName') channelName: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const channel = await this.channelService.getChannels(
        username,
        serverId,
        channelName,
      );
      return res.status(HttpStatus.OK).json(channel);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }

  @Get()
  async getChannelsByServer(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const channels = await this.channelService.getChannelsByServer(
        serverId,
        username,
      );
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
        body,
        username,
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
