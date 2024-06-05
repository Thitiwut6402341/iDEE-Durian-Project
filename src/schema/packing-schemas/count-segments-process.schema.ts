import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type CountSegmentsProcessDocument = CountSegmentsProcess & Document;

@Schema({ collection: 'CountSegmentsProcess', versionKey: false })
export class CountSegmentsProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  fruit_code: string;

  @Prop()
  tree_code: string;

  @Prop()
  inspected_grade: string;

  @Prop({ required: true })
  number_of_segments: number;

  @Prop({ required: true })
  maturity: number;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const CountSegmentsProcessSchema =
  SchemaFactory.createForClass(CountSegmentsProcess);
