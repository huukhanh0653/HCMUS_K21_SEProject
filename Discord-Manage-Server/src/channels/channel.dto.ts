import { IsNotEmpty, IsString, MaxLength, IsEnum } from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEnum(['text', 'voice'])
  type: string;
}
