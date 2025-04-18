import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BansService } from './ban.service';
import { BansController } from './ban.controller';
import { Ban } from './ban.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ban])],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
