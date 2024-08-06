import {
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class EditPackingHouseRegisterDto {

  @IsNotEmpty()
  packing_house_code: string;

  packing_house_name?: string;

  registration_no?: string;

  // province?: string;

  // district?: string;

  // sub_district?: string;

  // zip_code?: string;

  address?: string;

  doa_no?: string;

  doa_img?: string;

  gmp_no?: string;

  gmp_img?: string;

  latitude?: string;

  longitude?: string;

  title_name?: string;

  owner_first_name?: string;

  owner_last_name?: string;

  tax_id?: string;

  @IsString()
  phone?: string;

  email?: string;

  capacity_per_day?: number;

}
