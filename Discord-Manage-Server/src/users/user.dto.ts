import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsNumber,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsNumber()
  status: number;
}
