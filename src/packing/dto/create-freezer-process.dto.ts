import { IsArray, ArrayMinSize } from 'class-validator';

export class CreateFreezerProcessDto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
