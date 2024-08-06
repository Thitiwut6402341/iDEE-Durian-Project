import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ReserveTransportationDocument = ReserveTransportation & Document;

@Schema({ collection: 'ReserveTransportation', versionKey: false })
export class ReserveTransportation extends Document {
  @Prop()
  product_name: string;

  @Prop()
  email_freight: string;

  @Prop()
  packing_house_code: string;

  @Prop()
  orchard_codes: string[];

  @Prop()
  destination: string;

  @Prop()
  container_type: string;

  @Prop()
  number_of_container: number;

  // @Prop()
  // container_no: number;

  @Prop()
  date_time: string;

  @Prop()
  trademark_img: string;

  @Prop()
  product_list: string;

  @Prop()
  packaging_shape: string;

  @Prop()
  volume: number;

  @Prop({ unique: true })
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

  @Prop()
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ReserveTransportationSchema = SchemaFactory.createForClass(
  ReserveTransportation,
);
