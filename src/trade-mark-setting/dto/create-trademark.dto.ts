import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateTradeMarkDto {

    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    @IsNotEmpty()
    trademark_img: string;
}
