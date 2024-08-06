import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChinaLoadInProcessDocument = ChinaLoadInProcess & Document;

@Schema({ collection: 'ChinaLoadInProcess', versionKey: false })
export class ChinaLoadInProcess {
  @Prop()
  rfid_code: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ChinaLoadInProcessSchema =
  SchemaFactory.createForClass(ChinaLoadInProcess);
