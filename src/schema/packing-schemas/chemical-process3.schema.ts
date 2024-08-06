import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ChemicalProcess3Document = ChemicalProcess3 & Document;

@Schema({ collection: 'ChemicalProcess3', versionKey: false })
export class ChemicalProcess3 extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ChemicalProcess3Schema =
  SchemaFactory.createForClass(ChemicalProcess3);
