import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QAFreezerDto {
  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsString()
  @IsNotEmpty()
  packing_house_code: string;
}
