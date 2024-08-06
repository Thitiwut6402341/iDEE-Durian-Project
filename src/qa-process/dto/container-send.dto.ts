import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ContainerSendDto {
  @IsString()
  @IsNotEmpty()
  container_no: string;

  @IsString()
  @IsNotEmpty()
  reserve_id: string;

  @IsString()
  @IsNotEmpty()
  container_img: string;

  @IsString()
  @IsNotEmpty()
  seal_sending: string;

  @IsString()
  @IsNotEmpty()
  seal_no_sending: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   packing_house_code: string;
}
