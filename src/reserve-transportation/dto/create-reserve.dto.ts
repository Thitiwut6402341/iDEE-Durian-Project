import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReserveDto {
    @IsString()
    product_name: string;

    @IsString()
    packing_house_code: string;

    @IsString()
    destination: string;

    @IsString()
    container_type: string;

    @IsString()
    container_no: string;

    @IsNumber()
    weight: number;

    @IsString()
    date_time: string;

    @IsString()
    product_list: string;

    @IsString()
    packaging_shape: string;

    @IsNumber()
    volume: number;

    @IsString()
    booking_ref: string;

    @IsString()
    freight_forwarder: string;

    @IsString()
    export_type: string;

    // @IsString()
    air_line: string;

    // @IsString()
    flight: string;

    // @IsString()
    flight_depart_date: string;

    // @IsString()
    flight_arrive_date: string;

    @IsString()
    trade_mark: string;

    // @IsString()
    packaging_no: string;


}
