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
import { ServerService } from './server.service';
import { ServerDto } from './server.dto';
import { Response } from 'express';

@Controller('servers/:username')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post()
  async createServer(
    @Param('username') username: string,
    @Body() body: ServerDto,
    @Res() res: Response,
  ) {
    try {
      const server = await this.serverService.createServer(body, username);
      return res.status(HttpStatus.CREATED).json(server);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':serverName')
  async getServer(
    @Param('serverName') serverName: string,
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const servers = await this.serverService.getServers(username, serverName);
      return res.status(HttpStatus.OK).json(servers);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }

  @Get()
  async getAllServers(
    @Param('username') username: string,
    @Res() res: Response,
  ) {
    try {
      const servers = await this.serverService.getAllServers(username);
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
        body,
        username,
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
}
