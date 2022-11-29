import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CheckCouponCodeDto{
    // @IsArray()
    // @IsNotEmpty()
    // @ApiProperty()
    // product_ids: {
    //   product_id: number,
    //   quantity: number
    // }[];

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    coupon_code: string;

}