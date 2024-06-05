import { IsNotEmpty, IsString } from 'class-validator';

export class EditOrchardInfoDto {
  @IsNotEmpty()
  orchard_code: string;

  orchard_name: string;

  // province: string;

  // district: string;

  // sub_district: string;

  // zip_code: string;

  address: string;

  area_rai: number;

  area_ngan: number;

  area_wa: number;

  title_name: string;

  owner_first_name: string;

  owner_last_name: string;

  phone: string;

  email: string;

  latitude: string;

  longitude: string;

  gap_no: string;

  gap_img: string;

  tax_id: string;

  soil_type: string;

  total_trees: number;

  harvest_season: string;

  capacity: number;

  is_qa_verify?: boolean;

}
