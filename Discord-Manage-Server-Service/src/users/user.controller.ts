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
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: UserDto, @Res() res: Response) {
    try {
      const user = await this.userService.createUser(body);
      return res.status(HttpStatus.CREATED).json(user);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get(':username')
  async searchUsers(@Param('username') username: string, @Res() res: Response) {
    try {
      const user = await this.userService.searchUsers(username);
      return res.status(HttpStatus.OK).json(user);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }

  @Get()
  async getAllUsers(@Res() res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(HttpStatus.OK).json(users);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Put(':username')
  async updateUser(
    @Param('username') username: string,
    @Body() body: Partial<UserDto>,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.updateUser(username, body);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':username')
  async deleteUser(@Param('username') username: string, @Res() res: Response) {
    try {
      const result = await this.userService.deleteUser(username);
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
