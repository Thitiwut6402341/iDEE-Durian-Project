import { IsNotEmpty, IsString } from "class-validator";

export class FruitStatusByCodeDto {
    @IsString()
    @IsNotEmpty()
    fruit_code: string;

}
