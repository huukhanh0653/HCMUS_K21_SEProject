import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './friend.entity';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UserModule],
  providers: [FriendService],
  controllers: [FriendController],
})
export class FriendModule {}
