import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class PackingHouseInfoDto {
    @IsString()
    @IsNotEmpty()
    packing_house_code?: string;
}


