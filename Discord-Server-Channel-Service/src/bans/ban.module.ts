import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BansService } from './ban.service';
import { BansController } from './ban.controller';
import { Ban } from './ban.entity';
import { ServerMemberModule } from 'src/server_members/server_member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ban]), ServerMemberModule],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
