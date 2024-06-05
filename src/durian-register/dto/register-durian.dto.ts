import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class RegisterDurianDto {
    @IsString()
    @IsNotEmpty()
    tree_code: string;

    @IsArray()
    @IsNotEmpty()
    rfid_code: string[];
}
