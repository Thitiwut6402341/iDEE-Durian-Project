import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type vwFruitStatusDocument = Document<vwFruitStatus>;

@Schema({ collection: 'vwFruitStatus', versionKey: false })
export class vwFruitStatus {

    @Prop()
    fruit_code: string;

    @Prop()
    remark: string;

    @Prop()
    status: boolean;

    @Prop()
    rfid_code: string;

    @Prop()
    harvest_timestamp: Date;

    @Prop()
    tree_code: string;

    @Prop()
    cultivar: string;

    @Prop()
    orchard_name: string;

    @Prop()
    packing_name: string;

    @Prop()
    maturity: number;

    @Prop()
    segments: number;

    @Prop()
    weight: number;

    @Prop()
    inspected_grade: string;

    @Prop()
    grade: string;

    @Prop()
    qc_timestamp: Date;

    @Prop()
    remark_qc: string;

    @Prop()
    chemical1_timestamp: Date;

    @Prop()
    chemical2_timestamp: Date;

    @Prop()
    chemical3_timestamp: Date;

    @Prop()
    weighting_timestamp: Date;

    @Prop()
    packing_timestamp: Date;

    @Prop()
    freezer_timestamp: Date;

    @Prop()
    transport_timestamp: Date;

    @Prop()
    ch1_creator_by: string;

    @Prop()
    ch2_creator_by: string;

    @Prop()
    ch3_creator_by: string;

    @Prop()
    inspected_by: string;

    @Prop()
    weight_creator_by: string;

    @Prop()
    packing_creator_by: string;

    @Prop()
    freezer_creator_by: string;

    @Prop()
    packing_house_code: string;

    @Prop()
    province: string;

    @Prop()
    is_reject: boolean;

    @Prop()
    packaging_type: string;

    @Prop()
    reject_reason: string;

    @Prop()
    gps_no: string;

    @Prop()
    timestamp_reject: Date;

    @Prop()
    created_by: string;

    @Prop()
    delivery_name: string;

    @Prop()
    booking_ref: string;

    @Prop()
    depart_date_transport: Date;

    @Prop()
    departure_type: string;

    @Prop()
    airline: string;

    @Prop()
    flight: string;

    @Prop()
    flight_depart_date: Date;

    @Prop()
    flight_arrive_date: Date;

    @Prop()
    arrival_timestamp: Date;


}

export const vwFruitStatusSchema = SchemaFactory.createForClass(vwFruitStatus);