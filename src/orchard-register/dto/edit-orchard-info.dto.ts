import { IsNotEmpty, IsString } from 'class-validator';

export class EditOrchardInfoDto {
  @IsString()
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

  // @IsString()
  phone: string;

  email: string;

  latitude: string;

  longitude: string;

  gap_no: string;

  gap_img: string;

  gap_exp: string;

  tax_id: string;

  soil_type: string;

  total_trees: number;

  harvest_season: string;

  cultivar: string;

  avg_fruit_per_tree: number;

  is_qa_verify?: boolean;
}
