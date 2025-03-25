import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBoolean()
  is_private?: boolean;
}
