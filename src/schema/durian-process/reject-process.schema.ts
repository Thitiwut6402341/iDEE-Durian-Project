import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type RejectProcessDocument = RejectProcess & Document;

@Schema({ collection: 'RejectProcess', versionKey: false })
export class RejectProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  reject_reason: string;

  @Prop()
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const RejectProcessSchema = SchemaFactory.createForClass(RejectProcess);
