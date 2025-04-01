import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { Response } from 'express';

@Controller('friends/:username')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post(':friendUsername')
  async addFriend(
    @Param('username') username: string,
    @Param('friendUsername') friendUsername: string,
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

  @Delete(':friendUsername')
  async removeFriend(
    @Param('username') username: string,
    @Param('friendUsername') friendUsername: string,
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

  @Get()
  async getFriends(@Param('username') username: string, @Res() res: Response) {
    try {
      const friends = await this.friendService.getFriends(username);
      return res.status(HttpStatus.OK).json(friends);
    } catch (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: err.message });
    }
  }

  @Get('search')
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
}
