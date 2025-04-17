import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ServerMemberDto {
  @ApiProperty({
    description: 'The id of the member',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @ApiProperty({
    description: 'The role of the member',
    required: false,
    default: 'Member',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
