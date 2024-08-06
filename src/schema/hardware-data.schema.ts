import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HardwareDataCollectionDocument = Document<HardwareDataCollection>;

@Schema({ collection: 'HardwareDataCollection', versionKey: false }) //HardwareDataCollection //vwHardwareData
export class HardwareDataCollection {
  @Prop({ nullable: false })
  data: object[];

  @Prop({ nullable: false })
  created_at: Date;

  // @Prop({nullable: false, index: true})
  // date: string;
}

export const HardwareDataCollectionSchema = SchemaFactory.createForClass(
  HardwareDataCollection,
);
// HardwareDataCollectionSchema.index({ date: 1, created_at: 1 });
