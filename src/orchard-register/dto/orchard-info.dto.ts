import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class OrchardInfoDto {
    @IsString()
    @IsNotEmpty()
    orchard_code?: string;
}


