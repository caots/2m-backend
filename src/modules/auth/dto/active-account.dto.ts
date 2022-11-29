import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ActiveAccountDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}