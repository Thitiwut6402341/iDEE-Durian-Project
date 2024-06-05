import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWeightingsProcessDto {
  @IsString()
  @IsNotEmpty()
  rfid_code: string;

  @IsNumber()
  @IsNotEmpty()
  weight: number;
}
