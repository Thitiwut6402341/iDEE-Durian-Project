import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FreezerRoomDto {
  @IsString()
  @IsNotEmpty()
  packing_house_code: string;

  @IsNumber()
  @IsNotEmpty()
  temperature: number;

  @IsString()
  humidity: number;
}
