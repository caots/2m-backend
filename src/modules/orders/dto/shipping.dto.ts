import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDecimal, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { IsNull } from "typeorm";

export class ShippingDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    address: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    state: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    city: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    post_code: string;

    @IsString()
    @ApiProperty()
    @IsNotEmpty()
    country: string;

}