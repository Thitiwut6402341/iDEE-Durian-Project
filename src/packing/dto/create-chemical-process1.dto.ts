import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateChemicalProcess1Dto {
  @IsString()
  @IsNotEmpty()
  packing_house_code: string;

  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
