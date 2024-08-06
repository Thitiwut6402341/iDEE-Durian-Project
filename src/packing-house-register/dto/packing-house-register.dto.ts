import { IsNotEmpty, IsString } from 'class-validator';

export class PackingHouseRegisterDto {
  @IsString()
  @IsNotEmpty()
  packing_house_name: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  sub_district: string;

  @IsString()
  @IsNotEmpty()
  zip_code: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
