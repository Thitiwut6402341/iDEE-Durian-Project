import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterTreeDto {
    @IsString()
    @IsNotEmpty()
    orchard_code: string;

    @IsNumber()
    @IsNotEmpty()
    tree_number: number;

}
