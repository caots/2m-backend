import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from '../../auth/dto/user.create-dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }

export class UpdateEmailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}


export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  full_name: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty()
  age: number;
}
