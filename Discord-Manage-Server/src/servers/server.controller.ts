import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { Response } from 'express';
import { ServerDto } from './server.dto';

@Controller('servers/:username')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  async createServer(
    @Body() body: ServerDto,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const server = await this.serverService.createServer(username, body);
      return res.status(HttpStatus.CREATED).json(server);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get()
  async getServers(@Param('username') username: string, @Res() res: Response) {
    try {
      const servers = await this.serverService.getServers(username);
      return res.status(HttpStatus.OK).json(servers);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Put(':serverId')
  async updateServer(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Body() body: Partial<ServerDto>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.serverService.updateServer(
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
  async deleteServer(
    @Param('serverId') serverId: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.serverService.deleteServer(serverId, username);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('search')
  async searchServer(
    @Param() username: string,
    @Query('query') query: string,
    @Res() res: Response,
  ) {
    if (!query || query.trim() === '') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Query parameter is required');
    }

    try {
      const servers = await this.serverService.searchServer(username, query);
      return res.status(HttpStatus.OK).json(servers);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }
}
