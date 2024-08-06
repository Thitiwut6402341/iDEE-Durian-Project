import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ChemicalProcess2Document = ChemicalProcess2 & Document;

@Schema({ collection: 'ChemicalProcess2', versionKey: false })
export class ChemicalProcess2 extends Document {
  @Prop({ required: true })
  rfid_code: string;

  // @Prop({ required: true })
  // rfid_code: string[];

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ChemicalProcess2Schema =
  SchemaFactory.createForClass(ChemicalProcess2);
