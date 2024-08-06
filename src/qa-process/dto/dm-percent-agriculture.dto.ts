import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DMPercentageAgricultureDto {
  @IsString()
  @IsNotEmpty()
  reserve_id: string;

  @IsString()
  @IsNotEmpty()
  container_no: string;

  @IsNumber()
  @IsNotEmpty()
  dm_percentage: number;

  @IsString()
  dm_img: string;
}
