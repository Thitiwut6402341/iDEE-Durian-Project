import {
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrchardRegisterDto {

  @IsString()
  @IsNotEmpty()
  orchard_name: string;

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

  @IsNumber()
  // @IsNotEmpty()
  total_trees: number;

}
