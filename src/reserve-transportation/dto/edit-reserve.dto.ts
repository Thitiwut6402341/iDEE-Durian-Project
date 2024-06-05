import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsNull } from 'typeorm';

export class EditReserveDto {

    @IsString()
    @IsNotEmpty()
    reserve_id: string;

    product_name?: string;

    packing_house_code?: string;

    destination?: string;

    container_type?: string;

    container_no?: string;

    weight?: number;

    date_time?: string;

    product_list?: string;

    packaging_shape?: string;

    volume?: number;

    booking_ref?: string;

    freight_forwarder?: string;

    export_type?: string;

    air_line?: string;

    flight?: string;

    flight_depart_date?: string;

    flight_arrive_date?: string;

    trade_mark?: string;

    packaging_no?: string;

}
