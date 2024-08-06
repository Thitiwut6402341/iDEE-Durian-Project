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
    @IsNotEmpty()
    gmp_exp: Date

    doa_no: string

    doa_file: string

    doa_exp: Date

    du_no: string

    du_file: string

    du_exp: Date

    cn_no: string

    cn_file: string

    cn_exp: Date
}
