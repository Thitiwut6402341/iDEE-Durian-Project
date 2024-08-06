import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FruitStatusDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(['daily', 'monthly', 'period'], {message: 'period must be daily, monthly, or period'})
    period: string;

    @IsString()
    @IsNotEmpty()
    from: Date | string;

    @IsString()
    to: Date | string;

    @IsNumber()
    page: number;
}
