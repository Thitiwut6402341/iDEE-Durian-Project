import { IsNotEmpty, IsString } from "class-validator";

export class DocumentsDto {
    @IsString()
    @IsNotEmpty()
    booking_ref: string;
}
