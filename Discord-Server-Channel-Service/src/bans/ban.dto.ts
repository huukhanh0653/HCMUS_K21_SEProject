import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BanDto {
  @ApiProperty({
    description: 'The ID of the server where the ban is applied',
  })
  @IsNotEmpty()
  @IsUUID()
  serverId: string;

  @ApiProperty({
    description: 'The ID of the user to be banned',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The reason for the ban (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}
