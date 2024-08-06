import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DMPercentagePackingDto {
  @IsString()
  @IsNotEmpty()
  packing_house_code: string;

  @IsNumber()
  @IsNotEmpty()
  dm_percentage: number;

  @IsString()
  dm_img: string;
}
