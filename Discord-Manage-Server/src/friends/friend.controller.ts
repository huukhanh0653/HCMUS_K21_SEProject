import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { Response } from 'express';

@Controller('friends')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Get(':username')
  async getFriends(@Param('username') username: string, @Res() res: Response) {
    try {
      const friends = await this.friendService.getFriends(username);
      return res.status(HttpStatus.OK).json(friends);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('search/:username')
  async searchFriend(
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
      const friends = await this.friendService.searchFriend(username, query);
      return res.status(HttpStatus.OK).json(friends);
    } catch (err) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: err.message });
    }
  }

  @Post(':username')
  async addFriend(
    @Param('username') username: string,
    @Body('friend_username') friendUsername: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.friendService.addFriend(
        username,
        friendUsername,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Delete(':username')
  async removeFriend(
    @Param('username') username: string,
    @Body('friendUsername') friendUsername: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.friendService.removeFriend(
        username,
        friendUsername,
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }
}
