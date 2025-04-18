import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ban } from './ban.entity';
import { CreateBanDto } from './ban.dto';

@Injectable()
export class BansService {
  constructor(
    @InjectRepository(Ban)
    private readonly banRepository: Repository<Ban>,
  ) {}

  async addBan(createBanDto: CreateBanDto) {
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

    return { message: 'Ban created successfully', ban };
  }
}
