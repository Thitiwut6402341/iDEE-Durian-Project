import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ChemicalProcessDocument = ChemicalProcess & Document;

@Schema({ collection: 'ChemicalProcess1', versionKey: false })
export class ChemicalProcess extends Document {

  @Prop()
  packing_house_code: string;

  @Prop()
  fruit_code: string;

  @Prop({ required: true })
  rfid_code: string[];

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ChemicalProcessSchema = SchemaFactory.createForClass(ChemicalProcess);
