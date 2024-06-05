import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateWeightDto {
  @IsString()
  @IsNotEmpty()
  rfid_code: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;

  // @IsString()
  // @IsNotEmpty()
  // inspected_grade: string;

}
