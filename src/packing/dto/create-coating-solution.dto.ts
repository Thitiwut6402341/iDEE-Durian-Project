import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateCoatingSolutionDto {
  @IsArray()
  @IsNotEmpty()
  rfid_code: string[];
}
