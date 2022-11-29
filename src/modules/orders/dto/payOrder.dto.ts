import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PayOrdersDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cardToken: string; // result for createSource

    @IsString()
    @IsOptional()
    @ApiProperty()
    payment_method_id: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    payment_intent_id: string; //3DS

    @IsArray()
    @IsNotEmpty()
    @ApiProperty({example: [{
        id: 1,
        quantity: 2,
        options: JSON.stringify({
            name: 'option1',
            price: 12.30
        })
    }]})
    products: ProductItemCardDto[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipping_address: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipping_state: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipping_city: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipping_postcode: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    shipping_country: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    card_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    card_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    card_type: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    exp_date: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    cvc: string;
}

export class ProductItemCardDto {
    id: number;
    quantity: number;
    options: string;
}
export class OptionProductCardDto {
    name: string;
    price: number;
}