import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataCollectionDocument = DataCollection & Document;

@Schema({ collection: 'HardwareDataCollection', versionKey: false })
export class DataCollection extends Document {
  @Prop()
  data: object[];

  @Prop()
  created_at: Date;
}

export const DataCollectionSchema =
  SchemaFactory.createForClass(DataCollection);
