import { IsNotEmpty, IsMongoId } from 'class-validator';

export class FruitByReserveDto {
  @IsMongoId()
  @IsNotEmpty()
  reserve_id: string;

  container_no: string;
}
