import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelMemberDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
