import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './server.entity';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Server]), UserModule],
  providers: [ServerService],
  controllers: [ServerController],
  exports: [ServerService],
})
export class ServerModule {}
