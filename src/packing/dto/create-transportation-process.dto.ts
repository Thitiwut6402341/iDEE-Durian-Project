import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class CreateTransportationProcessDto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];

  @IsArray()
  @ArrayMinSize(1)
  timestamp: string[];

  @IsMongoId()
  @IsNotEmpty()
  reserve_id: string;

  @IsString()
  @IsNotEmpty()
  container_no: string;
}
