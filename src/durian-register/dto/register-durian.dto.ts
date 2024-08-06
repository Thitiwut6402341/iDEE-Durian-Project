import { IsArray, IsNotEmpty, IsString, ArrayMinSize } from 'class-validator';

export class RegisterDurianDto {
  @IsString()
  @IsNotEmpty()
  tree_code: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
