import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type TransportationDocument = Transportation & Document;

@Schema({ collection: 'Transportation', versionKey: false })
export class Transportation {
  @Prop()
  rfid_code: string;

  @Prop()
  reserve_id: mongo.ObjectId;

  @Prop()
  container_no: string;

  @Prop()
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TransportationSchema =
  SchemaFactory.createForClass(Transportation);
