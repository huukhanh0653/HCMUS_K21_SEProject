import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Friend } from '../friends/friend.entity';
import { FriendService } from '../friends/friend.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend])],
  providers: [UserService, FriendService],
  controllers: [UserController],
  exports: [UserService, FriendService],
})
export class UserModule {}
