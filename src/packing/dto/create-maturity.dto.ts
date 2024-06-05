import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateMaturityDto {
    @IsString()
    @IsNotEmpty()
    rfid_code: string;

    @IsNumber()
    @IsNotEmpty()
    maturity: number;

    @IsNumber()
    @IsNotEmpty()
    number_of_segment: number;

}
