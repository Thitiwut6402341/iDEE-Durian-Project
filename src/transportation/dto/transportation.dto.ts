import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class TransportationDto {

    @IsArray()
    rfid_code: string[];

    @IsString()
    @IsNotEmpty()
    booking_ref: string;
}
