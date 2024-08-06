import {
  IsNumber,
  IsIn,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreatePackingProcess2Dto {
  @IsNumber()
  @IsNotEmpty()
  @IsIn([1, 2, 4, 8])
  packaging_type: number;

  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];
}
