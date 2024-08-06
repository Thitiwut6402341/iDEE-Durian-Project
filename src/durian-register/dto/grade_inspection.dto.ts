import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator';

export class GradeInspectionDto {
  @IsArray()
  @ArrayMinSize(1)
  rfid_codes: string[];

  remarks?: string;

  @IsString()
  @IsNotEmpty()
  inspected_grade: string;
}
