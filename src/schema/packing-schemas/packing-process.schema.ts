import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type PackingProcessDocument = PackingProcess & Document;

@Schema({ collection: 'PackingProcess', versionKey: false })
export class PackingProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop({ required: true })
  packaging_type: string;


  @Prop({ required: true })
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const PackingProcessSchema =
  SchemaFactory.createForClass(PackingProcess);
