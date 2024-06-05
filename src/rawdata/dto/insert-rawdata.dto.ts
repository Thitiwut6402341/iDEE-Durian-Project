import { IsNotEmpty, } from 'class-validator';

export class InsertRawDataDto {
    @IsNotEmpty()
    information: any[];
}

