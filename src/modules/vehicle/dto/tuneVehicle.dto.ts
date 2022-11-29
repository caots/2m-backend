import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TuneVehicleDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    license_key: string;

    @IsArray()
    @IsNotEmpty()
    @ApiProperty()
    first_ids: string[];
}
export class UnStockVehicleDto{
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    vehicle_id: number;
}

export class FlashSuccessDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    license_key: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    vehicle_id: number;
} 