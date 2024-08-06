import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class EditTreeDto {
  @IsString()
  @IsNotEmpty()
  tree_code: string;

  @IsString()
  @IsMongoId()
  cultivar_id: string;

  latitude: string;

  longitude: string;

  plant_year: number;

  tree_height: number;

  circumference: number;

  fruit_per_tree: number;
}
