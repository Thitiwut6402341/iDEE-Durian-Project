import { IsNotEmpty, IsString } from "class-validator";

export class QAPackingHouseDto {
    @IsString()
    @IsNotEmpty()
    packing_house_code: string
    
    @IsString()
    @IsNotEmpty()
    gmp_no: string

    @IsString()
    @IsNotEmpty()
    gmp_file: string

    @IsString()
    doa_no: string

    @IsString()
    doa_file: string
}
