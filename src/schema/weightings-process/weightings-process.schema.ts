import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type WeightingsProcessDocument = Document<WeightingsProcess>;

@Schema({ collection: 'WeightingsProcess', versionKey: false })
export class WeightingsProcess {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  fruit_code: string;

  @Prop()
  weight: number;

  @Prop()
  tree_code: string;

  @Prop()
  packing_house_code: string;

  @Prop({ nullable: false })
  inspected_grade: string;

  @Prop({ nullable: false })
  maturity: number;

  @Prop({ nullable: false })
  number_of_segments: number;

  @Prop({ nullable: false })
  export_grade: string;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const WeightingsProcessSchema =
  SchemaFactory.createForClass(WeightingsProcess);
