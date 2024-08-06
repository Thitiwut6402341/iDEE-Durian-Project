import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class UpdateTradeMarkDto {

    @IsString()
    @IsNotEmpty()
    trademark_id: string;

    @IsString()
    @IsNotEmpty()
    product_name: string;

    @IsString()
    @IsNotEmpty()
    trademark_img: string;
}
