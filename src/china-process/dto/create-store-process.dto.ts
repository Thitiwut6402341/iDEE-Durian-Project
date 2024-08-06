import {
  ArrayMinSize,
  IsArray,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
} from 'class-validator';

export class CreateStoreDto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];

  @IsArray()
  @ArrayMinSize(1)
  timestamp: string[];
}
