import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ServerMemberDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  role_id?: string;
}
