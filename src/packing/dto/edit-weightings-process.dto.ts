import { IsArray, ArrayMinSize, IsString, IsNumber } from 'class-validator';

export class EditWeightingsProcessDto {
  @IsString()
  rfid_code: string;

  @IsString()
  inspected_grade: string;

  @IsNumber()
  number_of_segments: number;

  @IsNumber()
  weight: number;

  export_grade?: string;

  @IsNumber()
  maturity: number;

  remarks?: string;
}
