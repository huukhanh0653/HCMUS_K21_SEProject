import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class ChannelDto {
  @ApiProperty({
    description: 'The name of the channel',
    maxLength: 255,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'The type of the channel',
    default: 'text',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'The channel is private or not',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
