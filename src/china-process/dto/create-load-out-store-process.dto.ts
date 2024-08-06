import { ArrayMinSize, IsArray } from 'class-validator';

export class CreateLoadOutStoreDto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];

  @IsArray()
  @ArrayMinSize(1)
  timestamp: string[];
}
