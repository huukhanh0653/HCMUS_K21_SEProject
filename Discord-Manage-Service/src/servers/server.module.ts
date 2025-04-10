import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { Server } from './server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Server])],
  providers: [ServerService],
  controllers: [ServerController],
})
export class ServerModule {}
