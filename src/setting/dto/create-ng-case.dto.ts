import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNgCaseDto {
  @IsString()
  @IsNotEmpty()
  case_name: string;

  @IsString()
  description: string;
}
