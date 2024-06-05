import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCountSegmentsProcessDto {
  @IsString()
  @IsNotEmpty()
  rfid_code: string;

  @IsNumber()
  @IsNotEmpty()
  number_of_segments: number;

  @IsNumber()
  @IsNotEmpty()
  maturity: number;
}
