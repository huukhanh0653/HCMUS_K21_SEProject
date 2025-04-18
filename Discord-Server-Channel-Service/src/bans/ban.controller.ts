import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { BansService } from './ban.service';
import { CreateBanDto } from './ban.dto';
import { Ban } from './ban.entity';

@ApiTags('Bans')
@Controller('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a new ban in a server' })
  @ApiBody({ type: CreateBanDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The ban has been successfully created.',
    type: Ban,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User is already banned in this server.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  async create(@Body() createBanDto: CreateBanDto) {
    return await this.bansService.addBan(createBanDto);
  }
}
