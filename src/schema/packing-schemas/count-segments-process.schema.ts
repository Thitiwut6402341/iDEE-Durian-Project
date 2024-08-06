import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type CountSegmentsProcessDocument = CountSegmentsProcess & Document;

@Schema({ collection: 'CountSegmentsProcess', versionKey: false })
export class CountSegmentsProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop({ required: true })
  number_of_segments: number;

  @Prop({ required: true })
  maturity: number;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const CountSegmentsProcessSchema =
  SchemaFactory.createForClass(CountSegmentsProcess);
