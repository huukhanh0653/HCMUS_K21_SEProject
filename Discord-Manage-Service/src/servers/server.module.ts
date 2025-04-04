import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerService } from './server.service';
import { Server } from './server.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Server]), UserModule],
  providers: [ServerService],
})
export class ServerModule {}
