import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsFirebasePushId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    @Type(() => Number)
    price: number;
} 


export class CreateProductDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    @Type(() => Number)
    price: number;

    @IsString()
    @IsOptional()
    @ApiProperty()
    description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
	make: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
	model: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
	product_image: string;
	
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    size?: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
	year?: number;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example: [{
        name: "item",
        price: 12.30
    }]})
    productItems: ProductItemDto[];
} 

export class ProductItemDto {
    name: string;
    price: number;
}