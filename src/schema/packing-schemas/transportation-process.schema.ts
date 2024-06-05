import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type TransportationProcessDocument = TransportationProcess & Document;

@Schema({ collection: 'TransportationProcess', versionKey: false })
export class TransportationProcess extends Document {
  @Prop({ required: true })
  lot_id: string;

  @Prop({ required: true })
  rfid_code: string;

  @Prop({ required: true })
  booking_ref: string;

  @Prop({ nullable: false })
  origin: string; // packing house code

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const TransportationProcessSchema = SchemaFactory.createForClass(
  TransportationProcess,
);
