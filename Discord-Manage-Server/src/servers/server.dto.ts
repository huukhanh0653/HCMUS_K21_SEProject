import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ServerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;
}
