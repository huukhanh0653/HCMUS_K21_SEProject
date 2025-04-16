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
    description: "The id of the member's role",
    required: false,
  })
  @IsOptional()
  @IsString()
  roleId?: string;
}
