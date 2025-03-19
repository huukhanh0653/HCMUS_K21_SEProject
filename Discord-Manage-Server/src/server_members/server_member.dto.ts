import { IsEnum, IsOptional } from 'class-validator';

export class ServerMemberDto {
  @IsOptional()
  @IsEnum(['admin', 'member'])
  role?: string;
}
