import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChinaDeliveryProcessDocument = ChinaDeliveryProcess & Document;

@Schema({ collection: 'ChinaDeliveryProcess', versionKey: false })
export class ChinaDeliveryProcess {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  delivery_name: string;

  // @Prop()
  // delivery_code: string;

  // @Prop()
  // container_no: string;

  // @Prop()
  // packaging_id: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const ChinaDeliveryProcessSchema =
  SchemaFactory.createForClass(ChinaDeliveryProcess);
