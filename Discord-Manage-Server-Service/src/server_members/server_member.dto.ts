import { IsOptional, IsString } from 'class-validator';

export class ServerMemberDto {
  @IsOptional()
  @IsString()
  role_id?: string;
}
