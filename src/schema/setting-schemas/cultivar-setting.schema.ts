import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CultivarDocument = Cultivar & Document;

@Schema({ collection: 'Cultivar', versionKey: false })
export class Cultivar extends Document {
  @Prop({ required: true, unique: true })
  cultivar_th: string;

  @Prop({ required: true, unique: true })
  cultivar_en: string;

  @Prop()
  description: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const CultivarSchema = SchemaFactory.createForClass(Cultivar);
