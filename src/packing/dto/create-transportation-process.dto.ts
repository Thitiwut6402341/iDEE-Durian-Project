import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreateTransportationProcessDto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];

  @IsString()
  @IsNotEmpty()
  booking_ref: string;

  @IsString()
  @IsNotEmpty()
  packing_house_code: string;
}
