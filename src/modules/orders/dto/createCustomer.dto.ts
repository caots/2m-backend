import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDecimal, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto{
    name: string;
    email: string;
}