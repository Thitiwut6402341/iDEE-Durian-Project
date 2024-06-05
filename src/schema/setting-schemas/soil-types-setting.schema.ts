import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SoilTypesDocument = SoilTypes & Document;

@Schema({ collection: 'SoilTypes', versionKey: false })
export class SoilTypes extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;
}

export const SoilTypesSchema = SchemaFactory.createForClass(SoilTypes);
