import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdatePackagingNoDto {
    @IsString()
    @IsNotEmpty()
    booking_ref: string;

    @IsString()
    @IsNotEmpty()
    packaging_no: string;

}
