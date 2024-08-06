import { IsNotEmpty, IsNumber, IsString, IsMongoId } from 'class-validator';

export class RegisterTreeDto {
  @IsString()
  @IsNotEmpty()
  orchard_code: string;

  @IsNumber()
  @IsNotEmpty()
  tree_number: number;

  @IsMongoId()
  @IsNotEmpty()
  cultivar_id: string;
}
