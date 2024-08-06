import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DMPercentageDto {
  @IsString()
  @IsNotEmpty()
  orchard_code: string;

  @IsNumber()
  @IsNotEmpty()
  dm_percentage: number;

  @IsString()
  dm_img: string;
}
