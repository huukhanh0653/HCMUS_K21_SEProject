import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ban } from './ban.entity';
import { BanDto } from './ban.dto';
import { ServerMemberService } from 'src/server_members/server_member.service';

@Injectable()
export class BansService {
  constructor(
    @InjectRepository(Ban)
    private readonly banRepository: Repository<Ban>,
    private serverMemberService: ServerMemberService,
  ) {}

  async addBan(createBanDto: BanDto) {
    const { serverId, userId, reason } = createBanDto;

    const existingBan = await this.banRepository.findOne({
      where: { server_id: serverId, user_id: userId },
    });
    if (existingBan) {
      throw new ConflictException('User is already banned in this server');
    }

    const ban = this.banRepository.create({
      server_id: serverId,
      user_id: userId,
      reason,
    });

    this.banRepository.save(ban);
    await this.serverMemberService.outServer(serverId, userId);

    return { message: 'Ban created successfully', ban };
  }
}
