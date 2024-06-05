import { IsString, IsNotEmpty, IsArray, ArrayMinSize } from 'class-validator';

export class CreatePackingProcessDto {
  @IsString()
  @IsNotEmpty()
  packaging_type: string;

  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
