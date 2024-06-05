import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateApplyHormoneDto {
  @IsArray()
  @IsNotEmpty()
  rfid_code: string[];
}
