import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChinaRePackingProcessDocument = ChinaRePackingProcess & Document;

@Schema({ collection: 'ChinaRePackingProcess', versionKey: false })
export class ChinaRePackingProcess {
  @Prop()
  rfid_code: string;

  @Prop()
  weight_sale: number;

  // @Prop()
  // container_no: string;

  @Prop()
  packaging_id: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ChinaRePackingProcessSchema = SchemaFactory.createForClass(
  ChinaRePackingProcess,
);
