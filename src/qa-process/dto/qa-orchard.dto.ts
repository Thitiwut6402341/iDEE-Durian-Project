import { IsNotEmpty, IsString } from "class-validator";

export class QAOrchardDto {
    @IsString()
    @IsNotEmpty()
    orchard_code: string
    
    @IsString()
    @IsNotEmpty()
    gap_no: string

    @IsString()
    @IsNotEmpty()
    gap_file: string
}
