import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class TransportationDto {

    @IsArray()
    rfid_code: string[];

    @IsArray()
    timestamp: string[];

    @IsString()
    @IsNotEmpty()
    booking_ref: string;

    @IsString()
    @IsNotEmpty()
    container_no: string;
}
