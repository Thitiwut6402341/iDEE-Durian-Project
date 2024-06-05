import { IsNotEmpty, IsString } from "class-validator";

export class TreeDetailsDto {
    @IsString()
    @IsNotEmpty()
    tree_code: string;
}
