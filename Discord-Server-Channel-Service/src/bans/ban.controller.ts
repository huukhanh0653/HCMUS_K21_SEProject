import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BansService } from './ban.service';
import { BanDto } from './ban.dto';
import { Ban } from './ban.entity';

@ApiTags('Bans')
@Controller('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new ban in a server' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The ban has been successfully created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User is already banned in this server.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(@Body() createBanDto: BanDto) {
    return await this.bansService.addBan(createBanDto);
  }
}
