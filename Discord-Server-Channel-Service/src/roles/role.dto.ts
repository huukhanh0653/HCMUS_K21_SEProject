import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';

export class RoleDto {
  @ApiProperty({
    description: 'The name of the role',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The color of the role',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    description: 'The position of the role',
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiProperty({
    description: 'The role is default or not',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
