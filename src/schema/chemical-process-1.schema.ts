import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type ChemicalProcess1Document = ChemicalProcess1 & Document;

@Schema({ collection: 'ChemicalProcess1', versionKey: false })
export class ChemicalProcess1 extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop({ required: true })
  packing_house_code: string;

  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ChemicalProcess1Schema =
  SchemaFactory.createForClass(ChemicalProcess1);
