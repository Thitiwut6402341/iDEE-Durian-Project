import { IsNotEmpty, IsString } from "class-validator";

export class FruitStatusDto {
    @IsString()
    @IsNotEmpty()
    period: string;

    @IsString()
    @IsNotEmpty()
    from: Date | string;

    @IsString()
    to: Date | string;
}
