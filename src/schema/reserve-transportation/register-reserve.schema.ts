import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ReserveTransportationDocument = ReserveTransportation & Document;

@Schema({ collection: 'ReserveTransportation', versionKey: false })
export class ReserveTransportation extends Document {

    @Prop()
    creator_by: mongo.ObjectId;

    @Prop()
    product_name: string;

    @Prop()
    packing_house_code: string;

    @Prop()
    orchard_code: string[];

    @Prop()
    destination: string;

    @Prop()
    container_type: string;

    @Prop()
    container_no: string;

    @Prop()
    weight: number;

    @Prop()
    date_time: string;

    @Prop()
    product_list: string;

    @Prop()
    packaging_shape: string;

    @Prop()
    volume: number;

    @Prop()
    booking_ref: string;

    @Prop()
    freight_forwarder: string;

    @Prop()
    export_type: string;

    @Prop()
    air_line: string;

    @Prop()
    flight: string;

    @Prop()
    flight_depart_date: string;

    @Prop()
    flight_arrive_date: string;

    @Prop()
    trade_mark: string;

    @Prop()
    packaging_no: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ default: Date.now })
    updated_at: Date;
}

export const ReserveTransportationSchema =
    SchemaFactory.createForClass(ReserveTransportation);