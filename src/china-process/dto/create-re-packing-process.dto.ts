import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CreateRePackingProcessDto {
  @IsString()
  @IsNotEmpty()
  rfid_code: string;

  @IsNumber()
  @IsNotEmpty()
  weight_sale: number;

  @IsString()
  @IsNotEmpty()
  packaging_id: string;
}
