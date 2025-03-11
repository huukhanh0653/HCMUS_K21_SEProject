import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: UserDto, @Res() res: Response) {
    try {
      const newUser = await this.userService.createUser(body);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get()
  async search(@Query('query') query: string, @Res() res: Response) {
    if (!query || query.trim() === '') {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send('Query parameter is required');
    }

    try {
      const users = await this.userService.searchUser(query);
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).send(err.message);
    }
  }
}
