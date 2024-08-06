import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ContainerReceiveDto {
  @IsString()
  @IsNotEmpty()
  reserve_id: string;

  @IsString()
  @IsNotEmpty()
  container_no: string;

  @IsString()
  @IsNotEmpty()
  seal_receiving: string;

  @IsString()
  @IsNotEmpty()
  seal_no_receiving: string;

  @IsBoolean()
  is_seal_pass: boolean;

  @IsString()
  remarks: string;
}
