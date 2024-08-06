import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type TransportationDocument = Document<Transportation>;

@Schema({ collection: 'Transportation', versionKey: false })
export class Transportation {
  @Prop()
  container_no: string;

  @Prop()
  rfid_code: string[];

  @Prop()
  timestamp: string[];

  @Prop()
  booking_ref: string;

  @Prop()
  reserve_id: mongo.ObjectId;

  @Prop()
  gps_no: string;

  @Prop({ nullable: false })
  created_at: Date;

  @Prop({ nullable: false })
  updated_at: Date;
}

export const TransportationSchema =
  SchemaFactory.createForClass(Transportation);
