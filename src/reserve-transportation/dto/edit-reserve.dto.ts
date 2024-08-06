import { IsNotEmpty, IsNumber, IsString, IsIn } from 'class-validator';

export class EditReserveDto {
  @IsString()
  @IsNotEmpty()
  reserve_id: string;

  product_name?: string;

  container_no?: string;

  trademark_img?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['plane', 'train'])
  export_type: string;

  product_list?: string;

  packaging_shape?: string;

  volume?: number;

  booking_ref?: string;

  freight_forwarder?: string;

  air_line?: string;

  flight?: string;

  flight_depart_date?: string;

  flight_arrive_date?: string;

  email_freight?: string;
}
