import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class ServerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  server_pic?: string;
}
