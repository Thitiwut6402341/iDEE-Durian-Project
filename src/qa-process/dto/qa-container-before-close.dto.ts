import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class QAContainerBeforeCloseDto {
  @IsString()
  @IsNotEmpty()
  reserve_id: string;

  @IsString()
  @IsNotEmpty()
  container_no: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsString()
  @IsNotEmpty()
  gps_no: string;

  // @IsString()
  // @IsNotEmpty()
  // packing_house_code: string;
}
