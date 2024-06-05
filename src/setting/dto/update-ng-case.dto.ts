import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class UpdateNgCaseDto {
  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  case_id: string;

  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsString()
  description: string;
}
