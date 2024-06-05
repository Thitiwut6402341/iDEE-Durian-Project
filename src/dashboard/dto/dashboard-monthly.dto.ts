import {
    IsEmpty,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsString,

} from 'class-validator';

export class CreateDashboardMonthlyDto {
    @IsString()
    @IsNotEmpty()
    mode: "monthly" | "yearly";

    @IsNumber()
    @IsNotEmpty()
    year: number;

}
