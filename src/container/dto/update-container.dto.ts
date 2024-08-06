import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateContainerDto {
  @IsMongoId()
  @IsNotEmpty()
  container_id: string;

  @IsString()
  @IsNotEmpty()
  container_no: string;
}
