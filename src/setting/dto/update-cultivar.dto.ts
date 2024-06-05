import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class UpdateCultivarDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  cultivar_id: string;

  @IsString()
  @IsNotEmpty()
  cultivar_th: string;

  @IsString()
  @IsNotEmpty()
  cultivar_en: string;

  @IsString()
  description: string;
}
