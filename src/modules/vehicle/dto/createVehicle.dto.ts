import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateVehicleDto{
    @IsString()
    @IsOptional()
    @ApiProperty()
    vin_number: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    model: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    firmware: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    hardware: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    engine_code: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    make_car: string;

}