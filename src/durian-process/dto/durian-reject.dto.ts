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
    fruit_code: string;

    @IsString()
    @IsNotEmpty()
    reject_reason: string;

}
