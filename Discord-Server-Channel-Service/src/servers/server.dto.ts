import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class ServerDto {
  @ApiProperty({
    description: 'The name of the server',
    maxLength: 255,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The picture URL of the server',
    required: false,
  })
  @IsOptional()
  @IsString()
  serverPic?: string;
}
