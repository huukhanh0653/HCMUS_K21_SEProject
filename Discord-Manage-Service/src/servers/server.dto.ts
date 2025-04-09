import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsUrl,
} from 'class-validator';

export class ServerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  server_pic?: string;
}
