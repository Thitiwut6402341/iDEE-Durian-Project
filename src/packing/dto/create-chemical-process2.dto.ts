import { IsArray, ArrayMinSize } from 'class-validator';

export class CreateChemicalProcess2Dto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
