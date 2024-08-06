import { IsNotEmpty, IsMongoId, IsString } from 'class-validator';

export class ContainerSendDto {
  @IsMongoId()
  @IsNotEmpty()
  reserve_id: string;

  @IsString()
  @IsNotEmpty()
  container_no: string;
}
