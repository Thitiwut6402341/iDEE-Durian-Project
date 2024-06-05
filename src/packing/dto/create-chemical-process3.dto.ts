import { IsArray, ArrayMinSize } from 'class-validator';

export class CreateChemicalProcess3Dto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
