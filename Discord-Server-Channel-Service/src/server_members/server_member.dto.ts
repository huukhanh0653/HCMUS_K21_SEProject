import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ServerMemberDto {
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}
