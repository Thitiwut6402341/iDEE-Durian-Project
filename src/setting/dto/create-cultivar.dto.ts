import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCultivarDto {
  @IsString()
  @IsNotEmpty()
  cultivar_th: string;

  @IsString()
  @IsNotEmpty()
  cultivar_en: string;

  @IsString()
  description: string;
}
