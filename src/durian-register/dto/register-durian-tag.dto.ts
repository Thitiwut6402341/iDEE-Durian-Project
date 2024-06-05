import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterDurianTagDto {
    @IsString()
    @IsNotEmpty()
    province_name: string;

    @IsNumber()
    @IsNotEmpty()
    number_of_tag: number;
}
