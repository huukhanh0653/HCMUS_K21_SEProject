import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ServerMemberDto {
  @IsNotEmpty()
  @IsString()
  memberUsername: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}
