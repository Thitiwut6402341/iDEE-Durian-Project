import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateReserveDto {
  @IsString()
  product_name: string;

  @IsString()
  email_freight: string;

  @IsString()
  packing_house_code: string;

  @IsString()
  destination: string;

  @IsArray()
  orchard_codes: string[];

  @IsString()
  container_type: string;

  @IsNumber()
  number_of_container: number;

  @IsNumber()
  weight: number;

  @IsString()
  date_time: string;

  // @IsString()
  // product_list: string;

  // @IsString()
  // packaging_shape: string;

  // @IsNumber()
  // volume: number;

  // @IsString()
  // booking_ref: string;

  // @IsString()
  // freight_forwarder: string;

  // @IsString()
  // export_type: string;

  // air_line: string;

  // flight: string;

  // flight_depart_date: string;

  // flight_arrive_date: string;

  // @IsString()
  // trade_mark: string;

  // packaging_no: string;
}
