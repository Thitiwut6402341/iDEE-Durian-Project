import {
    IsEmpty,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
} from 'class-validator';

export class DurianRejectDto {

    @IsString()
    @IsNotEmpty()
    rfid_code: string;

    @IsString()
    @IsNotEmpty()
    reject_reason: string;

}
