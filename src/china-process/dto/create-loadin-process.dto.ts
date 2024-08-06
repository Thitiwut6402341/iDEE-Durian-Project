import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';

export class CreateLoadInDto {
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
