import { IsNotEmpty, IsString } from 'class-validator';

export class FruitStatusByCodeDto {
  @IsString()
  @IsNotEmpty()
  rfid_code: string;
}
