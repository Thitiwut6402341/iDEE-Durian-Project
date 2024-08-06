import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { mongo } from 'mongoose';

export type GpsTrackingDocument = GpsTracking & Document;

@Schema({ collection: 'GpsTracking', versionKey: false })
export class GpsTracking {
  @Prop()
  creator_by: mongo.ObjectId;

  @Prop()
  grade_system: string[];

  @Prop()
  effective_date: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const GpsTrackingSchema = SchemaFactory.createForClass(GpsTracking);
