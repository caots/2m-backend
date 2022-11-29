import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'user@mail.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Jonh' })
    name: string;

    @IsNumber()
    @ApiProperty({ example: '10' })
    age: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    password: string;
} 
