import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class LoginDto {
    @IsString()
    readonly accessToken: string;
} 

export class LoginBody {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'user@mail.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123456' })
    password: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({ example: '1' })
    is_mobile: number;
}

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    refreshToken: string;
}


