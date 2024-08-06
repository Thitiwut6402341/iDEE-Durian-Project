import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  delivery_name: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  rfid_codes: string[];

  @IsArray()
  @ArrayMinSize(1)
  timestamp: string[];
}
