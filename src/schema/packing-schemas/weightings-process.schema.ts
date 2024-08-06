import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type WeightingsProcessDocument = WeightingsProcess & Document;

@Schema({ collection: 'WeightingsProcess', versionKey: false })
export class WeightingsProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  weight: number;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const WeightingsProcessSchema =
  SchemaFactory.createForClass(WeightingsProcess);
