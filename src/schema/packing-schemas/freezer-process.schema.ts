import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type FreezerProcessDocument = FreezerProcess & Document;

@Schema({ collection: 'FreezerProcess', versionKey: false })
export class FreezerProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  creator_id: mongo.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;
}

export const FreezerProcessSchema =
  SchemaFactory.createForClass(FreezerProcess);
