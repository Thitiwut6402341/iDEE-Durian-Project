import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ChemicalProcess3Document = ChemicalProcess3 & Document;

@Schema({ collection: 'ChemicalProcess3', versionKey: false })
export class ChemicalProcess3 extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const ChemicalProcess3Schema =
  SchemaFactory.createForClass(ChemicalProcess3);
