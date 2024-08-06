import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, mongo } from 'mongoose';

export type FreezerProcessDocument = FreezerProcess & Document;

@Schema({ collection: 'FreezerProcess', versionKey: false })
export class FreezerProcess extends Document {
  @Prop({ required: true })
  rfid_code: string;

  @Prop()
  creator_id: mongo.ObjectId;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const FreezerProcessSchema =
  SchemaFactory.createForClass(FreezerProcess);
