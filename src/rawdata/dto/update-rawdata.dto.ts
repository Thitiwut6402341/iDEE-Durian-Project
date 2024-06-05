import { IsMongoId, IsNotEmpty, } from 'class-validator';

export class UpdateRawDataDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    information: object[];
}

