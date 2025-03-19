import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Query,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Res() res: Response) {
    try {
      const users = await this.userService.getUsers();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Post()
  async create(@Body() body: UserDto, @Res() res: Response) {
    try {
      const newUser = await this.userService.createUser(body);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('search')
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

  @Put(':username')
  async update(
    @Param('username') username: string,
    @Body() body: Partial<UserDto>,
    @Res() res: Response,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(username, body);
      return res.status(HttpStatus.OK).json(updatedUser);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':username')
  async delete(@Param('username') username: string, @Res() res: Response) {
    try {
      const result = await this.userService.deleteUser(username);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }
}
