import { IsNotEmpty, IsString } from "class-validator";

export class BookingDetailsDto {
    @IsString()
    @IsNotEmpty()
    booking_ref: string

}
